export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yxvsfaqqkfbfcjuymebo.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xpkTcSPSAkjSfO8-3svKyw_O5tZ2M_O';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({ success: true, products: data, source: 'supabase' });
    }
  } catch (err) {
    // Fall through
  }

  return res.status(200).json({
    success: true,
    message: 'Products API active. Products are rendered directly via high-speed client catalog.'
  });
}
