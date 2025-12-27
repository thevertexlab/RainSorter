import axios from 'axios';
import { PROXY_API_URL } from '../utils/constants';

export const exchangeCodeForToken = async (code, redirectUri) => {
  try {
    const response = await axios.post(`${PROXY_API_URL}/oauth/token`, {
      code,
      redirectUri
    });
    return response.data;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw new Error(error.response?.data?.error || 'Failed to exchange code for token');
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${PROXY_API_URL}/oauth/refresh`, {
      refreshToken
    });
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error(error.response?.data?.error || 'Failed to refresh access token');
  }
};
