import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Cache suggestions in localStorage (map of raindropId -> suggestions)
export const suggestionsAtom = atomWithStorage('raindrop_suggestions', {});
export const suggestionsLoadingAtom = atom(false);
export const fetchingSuggestionIdsAtom = atom(new Set());
