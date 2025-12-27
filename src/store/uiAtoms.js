import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const itemsPerPageAtom = atomWithStorage('raindrop_items_per_page', 50);
export const selectedSuggestionFolderAtom = atom(null); // null = show all
export const hideSortedAtom = atomWithStorage('raindrop_hide_sorted', false);
export const includeSorterTagAtom = atomWithStorage('raindrop_include_sorter_tag', true);
