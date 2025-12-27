import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { suggestionsAtom, suggestionsLoadingAtom, fetchingSuggestionIdsAtom } from '../store/suggestionsAtoms';
import { useAuth } from './useAuth';
import { fetchSuggestions } from '../services/collectionsApi';

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useAtom(suggestionsAtom);
  const [loading, setLoading] = useAtom(suggestionsLoadingAtom);
  const [fetchingIds, setFetchingIds] = useAtom(fetchingSuggestionIdsAtom);
  const { accessToken } = useAuth();

  const fetchSuggestionsForRaindrops = useCallback(async (raindrops) => {
    if (!accessToken || !raindrops || raindrops.length === 0) return;

    // Filter out raindrops that already have suggestions
    const raindropsToFetch = raindrops.filter(raindrop =>
      !suggestions[raindrop._id] && !fetchingIds.has(raindrop._id)
    );

    if (raindropsToFetch.length === 0) {
      console.log('All suggestions already fetched, skipping...');
      return;
    }

    console.log(`Fetching suggestions for ${raindropsToFetch.length} items (${raindrops.length - raindropsToFetch.length} already fetched)`);

    setLoading(true);

    const newSuggestions = { ...suggestions };
    const promises = [];

    for (const raindrop of raindropsToFetch) {

      // Mark as fetching
      setFetchingIds(prev => new Set([...prev, raindrop._id]));

      const promise = fetchSuggestions(accessToken, raindrop._id)
        .then(data => {
          newSuggestions[raindrop._id] = data;
          // Update suggestions atom immediately for real-time stats
          setSuggestions({ ...newSuggestions });
        })
        .catch(err => {
          console.error(`Failed to fetch suggestions for ${raindrop._id}:`, err);
          newSuggestions[raindrop._id] = { collections: [], tags: [] };
          setSuggestions({ ...newSuggestions });
        })
        .finally(() => {
          setFetchingIds(prev => {
            const next = new Set(prev);
            next.delete(raindrop._id);
            return next;
          });
        });

      promises.push(promise);

      // Limit concurrent requests to avoid rate limiting
      if (promises.length >= 5) {
        await Promise.all(promises);
        promises.length = 0;
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }

    setLoading(false);
  }, [accessToken, suggestions, fetchingIds, setSuggestions, setLoading, setFetchingIds]);

  const getSuggestionsForRaindrop = useCallback((raindropId) => {
    return suggestions[raindropId] || null;
  }, [suggestions]);

  const clearSuggestions = useCallback(() => {
    setSuggestions({});
    setFetchingIds(new Set());
  }, [setSuggestions, setFetchingIds]);

  return {
    suggestions,
    loading,
    fetchSuggestionsForRaindrops,
    getSuggestionsForRaindrop,
    clearSuggestions
  };
};
