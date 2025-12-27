import { useMemo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { totalCountAtom } from '../store/raindropsAtoms';
import { selectedSuggestionFolderAtom, hideSortedAtom } from '../store/uiAtoms';
import { suggestionsLoadingAtom } from '../store/suggestionsAtoms';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { RaindropRow } from './RaindropRow';
import { FolderItemsPanel } from './FolderItemsPanel';

export const RaindropsTable = ({
  raindrops,
  loading,
  error,
  onRetry,
  collectionsMap,
  getSuggestionsForRaindrop,
  onFetchSuggestions,
  suggestionsLoading
}) => {
  const [totalCount] = useAtom(totalCountAtom);
  const [selectedFolder] = useAtom(selectedSuggestionFolderAtom);
  const [hideSorted, setHideSorted] = useAtom(hideSortedAtom);
  const [isFetchingSuggestions] = useAtom(suggestionsLoadingAtom);

  // Calculate suggestion stats
  const suggestionStats = useMemo(() => {
    let suggested = 0;
    let noSuggestion = 0;
    let toFetch = 0;

    raindrops.forEach(raindrop => {
      const suggestions = getSuggestionsForRaindrop(raindrop._id);
      if (!suggestions) {
        toFetch++;
      } else if (suggestions.collections && suggestions.collections.length > 0) {
        suggested++;
      } else {
        noSuggestion++;
      }
    });

    return { suggested, noSuggestion, toFetch };
  }, [raindrops, getSuggestionsForRaindrop]);

  // Filter raindrops by selected suggestion folder and hide sorted
  const filteredRaindrops = useMemo(() => {
    let filtered = raindrops;

    // Hide sorted items (those with _rainsorter tag)
    if (hideSorted) {
      filtered = filtered.filter(raindrop =>
        !raindrop.tags || !raindrop.tags.includes('_rainsorter')
      );
    }

    // Filter by selected folder
    if (selectedFolder === null) return filtered;
    if (selectedFolder === 'no-suggestion') {
      return filtered.filter(raindrop => {
        const suggestions = getSuggestionsForRaindrop(raindrop._id);
        return suggestions && (!suggestions.collections || suggestions.collections.length === 0);
      });
    }

    return filtered.filter(raindrop => {
      const suggestions = getSuggestionsForRaindrop(raindrop._id);
      if (!suggestions || !suggestions.collections) return false;

      return suggestions.collections.some(col => col.$id === selectedFolder);
    });
  }, [raindrops, selectedFolder, getSuggestionsForRaindrop, hideSorted]);

  const handleRaindropMoved = useCallback((raindropId) => {
    // Trigger refetch to update the list
    onRetry();
  }, [onRetry]);

  // Get selected folder name for panel - MUST be before early returns
  const selectedFolderName = useMemo(() => {
    if (!selectedFolder || selectedFolder === 'no-suggestion') return null;
    return collectionsMap[selectedFolder];
  }, [selectedFolder, collectionsMap]);

  if (loading && raindrops.length === 0) {
    return <Loader message="Loading your unsorted bookmarks..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} />;
  }

  if (!raindrops || raindrops.length === 0) {
    return (
      <div className="empty-state">
        <h2>No unsorted bookmarks found</h2>
        <p>Your unsorted collection is empty. Great job organizing!</p>
      </div>
    );
  }

  if (selectedFolder !== null && filteredRaindrops.length === 0) {
    return (
      <div className="empty-state">
        <h2>No items for this folder</h2>
        <p>No raindrops were suggested for this folder.</p>
      </div>
    );
  }

  return (
    <div className="raindrops-table-container">
      {selectedFolder && selectedFolder !== 'no-suggestion' && selectedFolderName && (
        <FolderItemsPanel
          collectionId={selectedFolder}
          collectionName={selectedFolderName}
        />
      )}

      <div className="table-header">
        <div className="table-header-left">
          <h2 className="table-title">Unsorted Bookmarks</h2>
          <p className="table-count">
            {selectedFolder === null ? (
              <>
                Total: {totalCount} items
                {suggestionStats.suggested > 0 && ` • ${suggestionStats.suggested} suggested`}
                {suggestionStats.noSuggestion > 0 && ` • ${suggestionStats.noSuggestion} no suggestion`}
                {suggestionStats.toFetch > 0 && ` • ${suggestionStats.toFetch} to fetch`}
                {isFetchingSuggestions && <span className="fetching-indicator"> • fetching in progress...</span>}
              </>
            ) : (
              `Showing: ${filteredRaindrops.length} items`
            )}
          </p>
        </div>
        <div className="table-header-actions">
          <label className="hide-sorted-checkbox">
            <input
              type="checkbox"
              checked={hideSorted}
              onChange={(e) => setHideSorted(e.target.checked)}
            />
            <span>Hide sorted</span>
          </label>
          <button
            className="action-btn refresh-btn"
            onClick={onRetry}
            disabled={loading}
          >
            🔄 Refresh
          </button>
          <button
            className="action-btn suggestions-btn"
            onClick={onFetchSuggestions}
            disabled={suggestionsLoading || loading}
          >
            {suggestionsLoading ? '⏳ Fetching...' : '✨ Fetch Suggestions'}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="raindrops-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tags</th>
              <th>Suggested Folders</th>
              <th>JSON</th>
            </tr>
          </thead>
          <tbody>
            {filteredRaindrops.map((raindrop) => (
              <RaindropRow
                key={raindrop._id}
                raindrop={raindrop}
                collectionsMap={collectionsMap}
                getSuggestionsForRaindrop={getSuggestionsForRaindrop}
                onRaindropMoved={handleRaindropMoved}
              />
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="loading-overlay">
          <Loader message="Loading..." />
        </div>
      )}
    </div>
  );
};
