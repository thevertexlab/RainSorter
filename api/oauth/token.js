// Vercel Serverless Function: POST /api/oauth/token
// Proxies the Raindrop OAuth authorization code exchange to keep client_secret server-side.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'Missing required parameters: code and redirectUri' });
  }

  const clientId = process.env.RAINDROP_CLIENT_ID;
  const clientSecret = process.env.RAINDROP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing RAINDROP_CLIENT_ID or RAINDROP_CLIENT_SECRET env vars');
    return res.status(500).json({ error: 'Server misconfiguration: missing credentials' });
  }

  try {
    const response = await fetch('https://raindrop.io/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Raindrop token exchange error:', data);
      return res.status(response.status).json({ error: 'Token exchange failed', details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange exception:', error.message);
    return res.status(500).json({ error: 'Token exchange failed', details: error.message });
  }
}
