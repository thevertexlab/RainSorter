import { useEffect, useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import {
  raindropsAtom,
  raindropsLoadingAtom,
  raindropsErrorAtom,
  totalCountAtom
} from '../store/raindropsAtoms';
import { includeSorterTagAtom } from '../store/uiAtoms';
import { useAuth } from './useAuth';
import { fetchRaindrops, fetchRaindropsByTag } from '../services/raindropApi';
import { refreshAccessToken } from '../services/authService';
import { isTokenExpired } from '../utils/storage';

const API_MAX_PER_PAGE = 50;

export const useRaindrops = () => {
  const [raindrops, setRaindrops] = useAtom(raindropsAtom);
  const [loading, setLoading] = useAtom(raindropsLoadingAtom);
  const [error, setError] = useAtom(raindropsErrorAtom);
  const [, setTotalCount] = useAtom(totalCountAtom);
  const [includeSorterTag] = useAtom(includeSorterTagAtom);

  const { accessToken, refreshToken, saveTokens } = useAuth();
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  const loadRaindrops = useCallback(async (force = false) => {
    if (!accessToken || isFetchingRef.current) return;

    // Skip if already fetched (unless forcing refresh)
    if (!force && hasFetchedRef.current && raindrops.length > 0) return;

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

      const allItems = [];

      // Fetch ALL unsorted items (loop until no more items)
      let page = 0;
      let hasMore = true;
      while (hasMore) {
        const data = await fetchRaindrops(tokenToUse, page, API_MAX_PER_PAGE);
        allItems.push(...data.items);

        // Set total count from first response
        if (page === 0) {
          setTotalCount(data.count);
        }

        // Stop if we got fewer items than requested (end of data)
        if (data.items.length < API_MAX_PER_PAGE) {
          hasMore = false;
        } else {
          page++;
        }
      }

      // Fetch ALL _rainsorter tagged items if enabled
      if (includeSorterTag) {
        page = 0;
        hasMore = true;
        while (hasMore) {
          const data = await fetchRaindropsByTag(tokenToUse, '_rainsorter', page, API_MAX_PER_PAGE);
          allItems.push(...data.items);

          if (data.items.length < API_MAX_PER_PAGE) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }

      setRaindrops(allItems);
      hasFetchedRef.current = true;
    } catch (err) {
      console.error('Load raindrops error:', err);
      setError(err.message || 'Failed to load raindrops');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [accessToken, refreshToken, includeSorterTag, raindrops.length]);

  useEffect(() => {
    loadRaindrops(false);
  }, [accessToken, includeSorterTag]);

  const refetch = useCallback(() => {
    hasFetchedRef.current = false;
    loadRaindrops(true);
  }, [loadRaindrops]);

  return {
    raindrops,
    loading,
    error,
    refetch
  };
};
