export const API_BASE_URL = 'https://api.raindrop.io';
export const OAUTH_AUTHORIZE_URL = `${API_BASE_URL}/v1/oauth/authorize`;
export const OAUTH_TOKEN_URL = 'https://raindrop.io/oauth/access_token';

export const CLIENT_ID = import.meta.env.VITE_RAINDROP_CLIENT_ID;
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
export const PROXY_API_URL = import.meta.env.VITE_PROXY_API_URL;

export const COLLECTION_IDS = {
  ALL: 0,
  UNSORTED: -1,
  TRASH: -99
};
