import { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { Header } from '../components/Header';
import { RaindropsTable } from '../components/RaindropsTable';
import { SuggestionsSidebar } from '../components/SuggestionsSidebar';
import { useRaindrops } from '../hooks/useRaindrops';
import { useCollections } from '../hooks/useCollections';
import { useSuggestions } from '../hooks/useSuggestions';
import { suggestionsAtom } from '../store/suggestionsAtoms';

export const DashboardPage = () => {
  const { raindrops, loading, error, refetch } = useRaindrops();
  const { collectionsMap, loadCollections } = useCollections();
  const { fetchSuggestionsForRaindrops, getSuggestionsForRaindrop, loading: suggestionsLoading, clearSuggestions } = useSuggestions();
  const [suggestions] = useAtom(suggestionsAtom);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const handleFetchSuggestions = () => {
    fetchSuggestionsForRaindrops(raindrops);
  };

  const handleRefreshAll = useCallback(() => {
    // Clear suggestions cache
    clearSuggestions();
    // Reload collections
    loadCollections();
    // Reload raindrops
    refetch();
  }, [clearSuggestions, loadCollections, refetch]);

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-layout">
        <SuggestionsSidebar
          raindrops={raindrops}
          suggestions={suggestions}
        />
        <main className="dashboard-main">
          <RaindropsTable
            raindrops={raindrops}
            loading={loading}
            error={error}
            onRetry={handleRefreshAll}
            collectionsMap={collectionsMap}
            getSuggestionsForRaindrop={getSuggestionsForRaindrop}
            onFetchSuggestions={handleFetchSuggestions}
            suggestionsLoading={suggestionsLoading}
          />
        </main>
      </div>
    </div>
  );
};
