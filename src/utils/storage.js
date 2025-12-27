const STORAGE_KEYS = {
  ACCESS_TOKEN: 'raindrop_access_token',
  REFRESH_TOKEN: 'raindrop_refresh_token',
  TOKEN_EXPIRY: 'raindrop_token_expiry'
};

export const saveTokens = ({ accessToken, refreshToken, expiresIn }) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
  if (expiresIn) {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
  }
};

export const getTokens = () => {
  return {
    accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    tokenExpiry: localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
      ? parseInt(localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY), 10)
      : null
  };
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
};

export const isTokenExpired = () => {
  const { tokenExpiry } = getTokens();
  if (!tokenExpiry) return true;

  const fiveMinutesInMs = 5 * 60 * 1000;
  return Date.now() >= tokenExpiry - fiveMinutesInMs;
};
