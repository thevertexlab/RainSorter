import { OAUTH_AUTHORIZE_URL, CLIENT_ID, REDIRECT_URI } from '../utils/constants';
import { exchangeCodeForToken, refreshAccessToken as refreshToken } from './proxyApi';

export const initiateOAuth = () => {
  const authUrl = `${OAUTH_AUTHORIZE_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  console.log('🔐 OAuth URL:', authUrl);
  console.log('📍 Redirect URI:', REDIRECT_URI);
  window.location.href = authUrl;
};

export const handleCallback = async (code) => {
  if (!code) {
    throw new Error('No authorization code provided');
  }

  const tokenData = await exchangeCodeForToken(code, REDIRECT_URI);
  return tokenData;
};

export const refreshAccessToken = async (refreshToken) => {
  const tokenData = await refreshToken(refreshToken);
  return tokenData;
};

export const logout = () => {
  return true;
};
