import { formatDate, truncateUrl } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { updateRaindrop } from '../services/raindropApi';
import { useState } from 'react';
import { CollectionSelectorModal } from './CollectionSelectorModal';

export const RaindropRow = ({ raindrop, collectionsMap, getSuggestionsForRaindrop, onRaindropMoved }) => {
  const { title, link, tags, created, excerpt } = raindrop;
  const suggestions = getSuggestionsForRaindrop ? getSuggestionsForRaindrop(raindrop._id) : null;
  const { accessToken } = useAuth();
  const [moving, setMoving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleMoveToFolder = async (collectionId, isManual = false) => {
    if (moving || !accessToken) return;

    setMoving(true);
    try {
      const newTags = Array.isArray(tags) ? [...tags] : [];
      const tagToAdd = isManual ? '_rainsorter_manual' : '_rainsorter';

      if (!newTags.includes(tagToAdd)) {
        newTags.push(tagToAdd);
      }

      await updateRaindrop(accessToken, raindrop._id, {
        collection: { $id: collectionId },
        tags: newTags
      });

      if (onRaindropMoved) {
        onRaindropMoved(raindrop._id);
      }
    } catch (error) {
      console.error('Failed to move raindrop:', error);
      alert('Failed to move item: ' + error.message);
    } finally {
      setMoving(false);
    }
  };

  const handleManualSelect = (collectionId) => {
    handleMoveToFolder(collectionId, true);
  };

  return (
    <tr className="raindrop-row">
      <td className="raindrop-title-cell">
        <a href={link} target="_blank" rel="noopener noreferrer" className="raindrop-link" title={title}>
          {title || 'Untitled'}
        </a>
        <div className="raindrop-meta">
          <span className="url-text" title={link}>{truncateUrl(link)}</span>
          <span className="meta-separator">·</span>
          <span className="date-text">{formatDate(created)}</span>
        </div>
        {excerpt && (
          <div className="raindrop-excerpt">
            {excerpt}
          </div>
        )}
      </td>
      <td className="raindrop-tags">
        {tags && tags.length > 0 ? (
          <div className="tags-container">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag-badge">
                {tag}
              </span>
            ))}
            {tags.length > 3 && <span className="tag-badge">+{tags.length - 3}</span>}
          </div>
        ) : (
          <span className="no-tags">No tags</span>
        )}
      </td>
      <td className="raindrop-suggestions">
        {moving && <span className="moving-indicator">Moving...</span>}
        {!moving && suggestions ? (
          <div className="suggestions-with-edit">
            {suggestions.collections && suggestions.collections.length > 0 ? (
              <div className="suggestions-container">
                {suggestions.collections.slice(0, 3).map((col, index) => (
                  <button
                    key={index}
                    className="suggestion-badge clickable"
                    onClick={() => handleMoveToFolder(col.$id)}
                    title={`Move to ${collectionsMap[col.$id] || `ID: ${col.$id}`}`}
                  >
                    {collectionsMap[col.$id] || `ID: ${col.$id}`}
                    {col.confidence && <span className="confidence"> ({Math.round(col.confidence * 100)}%)</span>}
                  </button>
                ))}
                {suggestions.collections.length > 3 && (
                  <span className="suggestion-badge">+{suggestions.collections.length - 3}</span>
                )}
              </div>
            ) : (
              <span className="no-suggestions">No suggestions</span>
            )}
            <button
              className="edit-collection-btn"
              onClick={() => setShowModal(true)}
              title="Manually select collection"
            >
              ✏️
            </button>
          </div>
        ) : !moving ? (
          <span className="no-suggestions">-</span>
        ) : null}

        {showModal && (
          <CollectionSelectorModal
            onClose={() => setShowModal(false)}
            onSelect={handleManualSelect}
          />
        )}
      </td>
      <td className="raindrop-json">
        <span className="json-icon">
          &lt;/&gt;
          <pre className="json-tooltip">{JSON.stringify(raindrop, null, 2)}</pre>
        </span>
      </td>
    </tr>
  );
};
