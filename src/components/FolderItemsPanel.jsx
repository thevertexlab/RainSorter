import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchRaindropsByCollection } from '../services/raindropApi';

const API_MAX_PER_PAGE = 50;

export const FolderItemsPanel = ({ collectionId, collectionName }) => {
  const { accessToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded

  useEffect(() => {
    if (!collectionId || !accessToken || collectionId === 'no-suggestion') return;

    const loadItems = async () => {
      setLoading(true);
      try {
        // Fetch ALL items from this collection
        const allItems = [];
        let page = 0;
        let hasMore = true;

        while (hasMore) {
          const data = await fetchRaindropsByCollection(accessToken, collectionId, page, API_MAX_PER_PAGE);
          allItems.push(...data.items);

          if (data.items.length < API_MAX_PER_PAGE) {
            hasMore = false;
          } else {
            page++;
          }
        }

        setItems(allItems);
      } catch (error) {
        console.error('Failed to load folder items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [collectionId, accessToken]);

  if (!collectionId || collectionId === 'no-suggestion') return null;

  const extractDomain = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="folder-items-panel">
      <button
        className="panel-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="panel-title">
          📂 Items in "{collectionName}" ({items.length})
        </span>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="panel-content">
          {loading ? (
            <div className="panel-loading">Loading...</div>
          ) : items.length === 0 ? (
            <div className="panel-empty">No items in this folder yet</div>
          ) : (
            <div className="panel-tags">
              {items.map((item) => (
                <a
                  key={item._id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="item-tag"
                  title={`${item.title} - ${item.link}`}
                >
                  {item.title || 'Untitled'} | {extractDomain(item.link)}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
