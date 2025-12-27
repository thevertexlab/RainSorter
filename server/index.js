const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.post('/api/oauth/token', async (req, res) => {
  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'Missing required parameters: code and redirectUri' });
  }

  try {
    const response = await axios.post('https://raindrop.io/oauth/access_token', {
      code,
      client_id: process.env.RAINDROP_CLIENT_ID,
      client_secret: process.env.RAINDROP_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Token exchange failed',
      details: error.response?.data || error.message
    });
  }
});

app.post('/api/oauth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing required parameter: refreshToken' });
  }

  try {
    const response = await axios.post('https://raindrop.io/oauth/access_token', {
      client_id: process.env.RAINDROP_CLIENT_ID,
      client_secret: process.env.RAINDROP_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Token refresh failed',
      details: error.response?.data || error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RainSorter OAuth proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 OAuth proxy server running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
