import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Cache collections in localStorage
export const collectionsAtom = atomWithStorage('raindrop_collections', []);
export const collectionsLoadingAtom = atom(false);
export const collectionsErrorAtom = atom(null);

// Derived atom to create ID -> Name map
export const collectionsMapAtom = atom((get) => {
  const collections = get(collectionsAtom);
  const map = {};

  collections.forEach(collection => {
    map[collection._id] = collection.title;
  });

  return map;
});

// Build tree structure from collections
function buildTree(collections) {
  const map = {};
  const roots = [];

  // First pass: create map of all collections
  collections.forEach(col => {
    map[col._id] = { ...col, children: [] };
  });

  // Second pass: build parent-child relationships
  collections.forEach(col => {
    const node = map[col._id];
    if (col.parent && col.parent.$id && map[col.parent.$id]) {
      map[col.parent.$id].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

// Derived atom for collections tree
export const collectionsTreeAtom = atom((get) => {
  const collections = get(collectionsAtom);
  return buildTree(collections);
});
