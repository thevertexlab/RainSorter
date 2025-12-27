import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { collectionsAtom, collectionsLoadingAtom, collectionsErrorAtom, collectionsMapAtom } from '../store/collectionsAtoms';
import { useAuth } from './useAuth';
import { fetchCollections } from '../services/collectionsApi';

export const useCollections = () => {
  const [collections, setCollections] = useAtom(collectionsAtom);
  const [loading, setLoading] = useAtom(collectionsLoadingAtom);
  const [error, setError] = useAtom(collectionsErrorAtom);
  const [collectionsMap] = useAtom(collectionsMapAtom);
  const { accessToken } = useAuth();

  const loadCollections = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCollections(accessToken);
      setCollections(data);
    } catch (err) {
      console.error('Load collections error:', err);
      setError(err.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [accessToken, setCollections, setLoading, setError]);

  return {
    collections,
    collectionsMap,
    loading,
    error,
    loadCollections
  };
};
