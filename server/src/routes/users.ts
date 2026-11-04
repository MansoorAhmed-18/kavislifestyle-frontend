import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const dbPath = path.resolve(__dirname, '../../../users-db.json');

const readUsers = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read users-db.json in server', e);
  }
  return [];
};

const writeUsers = (users: any[]) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write users-db.json in server', e);
  }
};

// GET /api/users
router.get('/', (req: Request, res: Response) => {
  const users = readUsers();
  res.json({ success: true, users });
});

// POST /api/users
router.post('/', (req: Request, res: Response) => {
  try {
    const userAccount = req.body;
    if (!userAccount || !userAccount.email) {
      res.status(400).json({ error: 'User email is required' });
      return;
    }
    const users = readUsers();
    const normEmail = userAccount.email.toLowerCase().trim();
    const existingIdx = users.findIndex((u: any) => u.email.toLowerCase().trim() === normEmail);
    let nextUsers;
    if (existingIdx >= 0) {
      nextUsers = users.map((u: any, idx: number) => (idx === existingIdx ? { ...u, ...userAccount } : u));
    } else {
      nextUsers = [...users, userAccount];
    }
    writeUsers(nextUsers);
    res.json({ success: true, user: userAccount, users: nextUsers });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
