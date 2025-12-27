import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { itemsPerPageAtom } from './uiAtoms';

// Cache raindrops in localStorage
export const raindropsAtom = atomWithStorage('raindrop_items', []);
export const raindropsLoadingAtom = atom(false);
export const raindropsErrorAtom = atom(null);
export const currentPageAtom = atom(0);
export const totalCountAtom = atomWithStorage('raindrop_total_count', 0);

export const totalPagesAtom = atom((get) => {
  const total = get(totalCountAtom);
  const perPage = get(itemsPerPageAtom);
  return Math.ceil(total / perPage);
});
