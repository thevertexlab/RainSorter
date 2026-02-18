// Vercel Serverless Function: POST /api/oauth/refresh
// Proxies the Raindrop OAuth refresh token exchange to keep client_secret server-side.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing required parameter: refreshToken' });
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
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Raindrop token refresh error:', data);
      return res.status(response.status).json({ error: 'Token refresh failed', details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Token refresh exception:', error.message);
    return res.status(500).json({ error: 'Token refresh failed', details: error.message });
  }
}
