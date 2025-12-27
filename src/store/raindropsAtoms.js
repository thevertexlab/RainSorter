import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Cache raindrops in localStorage
export const raindropsAtom = atomWithStorage('raindrop_items', []);
export const raindropsLoadingAtom = atom(false);
export const raindropsErrorAtom = atom(null);
export const totalCountAtom = atomWithStorage('raindrop_total_count', 0);
