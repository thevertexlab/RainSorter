import { useEffect, useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import {
  raindropsAtom,
  raindropsLoadingAtom,
  raindropsErrorAtom,
  currentPageAtom,
  totalCountAtom
} from '../store/raindropsAtoms';
import { itemsPerPageAtom, includeSorterTagAtom } from '../store/uiAtoms';
import { useAuth } from './useAuth';
import { fetchRaindrops, fetchRaindropsByTag } from '../services/raindropApi';
import { refreshAccessToken } from '../services/authService';
import { isTokenExpired } from '../utils/storage';

const API_MAX_PER_PAGE = 50;

export const useRaindrops = () => {
  const [raindrops, setRaindrops] = useAtom(raindropsAtom);
  const [loading, setLoading] = useAtom(raindropsLoadingAtom);
  const [error, setError] = useAtom(raindropsErrorAtom);
  const [currentPage] = useAtom(currentPageAtom);
  const [, setTotalCount] = useAtom(totalCountAtom);
  const [perPage] = useAtom(itemsPerPageAtom);
  const [includeSorterTag] = useAtom(includeSorterTagAtom);

  const { accessToken, refreshToken, saveTokens } = useAuth();
  const isFetchingRef = useRef(false);
  const lastFetchKeyRef = useRef(null);

  const loadRaindrops = useCallback(async (force = false) => {
    if (!accessToken || isFetchingRef.current) return;

    // Create a key from current pagination state
    const fetchKey = `${currentPage}-${perPage}`;

    // Skip if already fetched this exact page/perPage combo (unless forcing refresh)
    if (!force && lastFetchKeyRef.current === fetchKey && raindrops.length > 0) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      let tokenToUse = accessToken;

      if (isTokenExpired() && refreshToken) {
        try {
          const newTokenData = await refreshAccessToken(refreshToken);
          saveTokens(newTokenData);
          tokenToUse = newTokenData.access_token;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please login again.');
        }
      }

      // Calculate how many pages we need to fetch
      const pagesNeeded = Math.ceil(perPage / API_MAX_PER_PAGE);
      const allItems = [];

      // Fetch unsorted items
      for (let i = 0; i < pagesNeeded; i++) {
        const data = await fetchRaindrops(tokenToUse, currentPage * pagesNeeded + i, API_MAX_PER_PAGE);
        allItems.push(...data.items);

        // Set total count from first response
        if (i === 0) {
          setTotalCount(data.count);
        }

        // Stop if we got fewer items than requested (end of data)
        if (data.items.length < API_MAX_PER_PAGE) {
          break;
        }
      }

      // Fetch _rainsorter tagged items if enabled
      if (includeSorterTag) {
        const sorterPagesNeeded = Math.ceil(perPage / API_MAX_PER_PAGE);
        for (let i = 0; i < sorterPagesNeeded; i++) {
          const data = await fetchRaindropsByTag(tokenToUse, '_rainsorter', currentPage * sorterPagesNeeded + i, API_MAX_PER_PAGE);
          allItems.push(...data.items);

          if (data.items.length < API_MAX_PER_PAGE) {
            break;
          }
        }
      }

      setRaindrops(allItems.slice(0, perPage));
      lastFetchKeyRef.current = fetchKey;
    } catch (err) {
      console.error('Load raindrops error:', err);
      setError(err.message || 'Failed to load raindrops');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [accessToken, refreshToken, currentPage, perPage, includeSorterTag, raindrops.length]);

  useEffect(() => {
    loadRaindrops(false);
  }, [accessToken, currentPage, perPage, includeSorterTag]);

  const refetch = useCallback(() => {
    lastFetchKeyRef.current = null;
    loadRaindrops(true);
  }, [loadRaindrops]);

  return {
    raindrops,
    loading,
    error,
    refetch
  };
};
