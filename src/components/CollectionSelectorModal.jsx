import { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { collectionsTreeAtom } from '../store/collectionsAtoms';

const TreeNode = ({ node, onSelect, searchTerm, depth = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;
  const matchesSearch = !searchTerm ||
    node.title.toLowerCase().includes(searchTerm.toLowerCase());

  // Filter children that match search
  const visibleChildren = hasChildren
    ? node.children.filter(child => {
        const childMatches = child.title.toLowerCase().includes(searchTerm.toLowerCase());
        const hasMatchingDescendants = hasDescendants(child, searchTerm);
        return childMatches || hasMatchingDescendants;
      })
    : [];

  if (!matchesSearch && visibleChildren.length === 0) return null;

  return (
    <>
      <button
        className="collection-tree-item"
        onClick={() => onSelect(node._id)}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        <span className="collection-icon">{hasChildren ? '📁' : '📄'}</span>
        <span className="collection-name">{node.title}</span>
        {node.count > 0 && <span className="collection-count">{node.count}</span>}
      </button>
      {visibleChildren.length > 0 && visibleChildren.map(child => (
        <TreeNode
          key={child._id}
          node={child}
          onSelect={onSelect}
          searchTerm={searchTerm}
          depth={depth + 1}
        />
      ))}
    </>
  );
};

// Helper to check if node has matching descendants
const hasDescendants = (node, searchTerm) => {
  if (!searchTerm || !node.children) return false;

  return node.children.some(child => {
    const matches = child.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matches || hasDescendants(child, searchTerm);
  });
};

export const CollectionSelectorModal = ({ onClose, onSelect }) => {
  const [tree] = useAtom(collectionsTreeAtom);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (collectionId) => {
    onSelect(collectionId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Select collection</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-search">
          <input
            type="text"
            className="modal-search-input"
            placeholder="Find or create new collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-body">
          <div className="collections-section">
            <h3 className="section-label">Collections</h3>
            <div className="collections-tree">
              {tree.map(node => (
                <TreeNode
                  key={node._id}
                  node={node}
                  onSelect={handleSelect}
                  searchTerm={searchTerm}
                  depth={0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
