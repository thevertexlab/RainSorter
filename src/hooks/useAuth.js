import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom, refreshTokenAtom, tokenExpiryAtom, isAuthenticatedAtom } from '../store/authAtoms';
import { initiateOAuth, logout as authLogout } from '../services/authService';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
  const [tokenExpiry, setTokenExpiry] = useAtom(tokenExpiryAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  const login = useCallback(() => {
    initiateOAuth();
  }, []);

  const saveTokens = useCallback((tokenData) => {
    if (tokenData.access_token) {
      setAccessToken(tokenData.access_token);
    }
    if (tokenData.refresh_token) {
      setRefreshToken(tokenData.refresh_token);
    }
    if (tokenData.expires_in) {
      const expiryTime = Date.now() + tokenData.expires_in * 1000;
      setTokenExpiry(expiryTime);
    }
  }, [setAccessToken, setRefreshToken, setTokenExpiry]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setTokenExpiry(null);
    authLogout();
  }, [setAccessToken, setRefreshToken, setTokenExpiry]);

  return {
    accessToken,
    refreshToken,
    tokenExpiry,
    isAuthenticated,
    login,
    logout,
    saveTokens
  };
};
