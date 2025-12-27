import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const selectedSuggestionFolderAtom = atom(null); // null = show all
export const hideSortedAtom = atomWithStorage('raindrop_hide_sorted', false);
export const includeSorterTagAtom = atomWithStorage('raindrop_include_sorter_tag', true);
