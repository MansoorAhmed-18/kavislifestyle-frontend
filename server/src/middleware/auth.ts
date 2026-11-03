import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!isSupabaseConfigured) {
    // Development mode fallback
    req.user = { id: 'dev-user-id', email: 'dev@kavislifestyle.com', role: 'customer' };
    next();
    return;
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized: Invalid authentication session' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return;
  }

  if (!isSupabaseConfigured) {
    // Development fallback
    next();
    return;
  }

  try {
    const { data: adminRecord, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, role, is_active')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .single();

    if (error || !adminRecord) {
      res.status(403).json({ error: 'Forbidden: Administrative access required' });
      return;
    }

    next();
  } catch (err) {
    res.status(403).json({ error: 'Failed to verify administrative authorization' });
  }
};
