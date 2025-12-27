import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { selectedSuggestionFolderAtom } from '../store/uiAtoms';
import { collectionsTreeAtom } from '../store/collectionsAtoms';

const TreeNode = ({ node, counts, selectedFolder, setSelectedFolder, depth = 0 }) => {
  const count = counts[node._id] || 0;
  const hasChildren = node.children && node.children.length > 0;
  const isEmptyParent = count === 0 && hasChildren;

  return (
    <>
      <button
        className={`folder-item ${selectedFolder === node._id ? 'active' : ''} ${isEmptyParent ? 'empty-parent' : ''}`}
        onClick={() => count > 0 && setSelectedFolder(node._id)}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
        disabled={count === 0}
      >
        <span className="folder-name" title={node.title}>
          {hasChildren ? '📁' : '📄'} {node.title}
        </span>
        {count > 0 && <span className="folder-count">{count}</span>}
      </button>
      {hasChildren && node.children.map(child => (
        <TreeNode
          key={child._id}
          node={child}
          counts={counts}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          depth={depth + 1}
        />
      ))}
    </>
  );
};

export const SuggestionsSidebar = ({ raindrops, suggestions }) => {
  const [selectedFolder, setSelectedFolder] = useAtom(selectedSuggestionFolderAtom);
  const [tree] = useAtom(collectionsTreeAtom);

  const folderCounts = useMemo(() => {
    const counts = {};

    raindrops.forEach(raindrop => {
      const raindropSuggestions = suggestions[raindrop._id];
      if (raindropSuggestions && raindropSuggestions.collections) {
        raindropSuggestions.collections.forEach(col => {
          const folderId = col.$id;
          counts[folderId] = (counts[folderId] || 0) + 1;
        });
      }
    });

    return counts;
  }, [raindrops, suggestions]);

  const totalSuggested = raindrops.filter(r => {
    const s = suggestions[r._id];
    return s && s.collections && s.collections.length > 0;
  }).length;

  const hasSuggestions = Object.keys(folderCounts).length > 0;

  if (!hasSuggestions) {
    return (
      <aside className="suggestions-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">📁 Suggested Folders</h3>
          <p className="sidebar-subtitle">No suggestions yet</p>
        </div>
        <div className="sidebar-empty">
          <p>Click "Fetch Suggestions" to see folder recommendations</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="suggestions-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">📁 Suggested Folders</h3>
        <p className="sidebar-subtitle">{totalSuggested} items have suggestions</p>
      </div>

      <div className="sidebar-content">
        <button
          className={`folder-item ${selectedFolder === null ? 'active' : ''}`}
          onClick={() => setSelectedFolder(null)}
        >
          <span className="folder-name">🌐 All Unsorted Items</span>
          <span className="folder-count">{raindrops.length}</span>
        </button>

        <button
          className={`folder-item ${selectedFolder === 'no-suggestion' ? 'active' : ''}`}
          onClick={() => setSelectedFolder('no-suggestion')}
        >
          <span className="folder-name">❌ No Suggestion</span>
          <span className="folder-count">
            {raindrops.filter(r => {
              const s = suggestions[r._id];
              return s && (!s.collections || s.collections.length === 0);
            }).length}
          </span>
        </button>

        <div className="folder-divider"></div>

        {tree.map(node => (
          <TreeNode
            key={node._id}
            node={node}
            counts={folderCounts}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            depth={0}
          />
        ))}
      </div>
    </aside>
  );
};
