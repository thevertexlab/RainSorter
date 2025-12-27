import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { handleCallback } from '../services/authService';

export const useOAuthCallback = (code) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { saveTokens } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      if (!code) {
        setError('No authorization code found');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const tokenData = await handleCallback(code);
        saveTokens(tokenData);
        window.location.href = '/';
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Failed to complete authentication');
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [code, saveTokens]);

  return { loading, error };
};
