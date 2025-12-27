import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const accessTokenAtom = atomWithStorage('raindrop_access_token', null);
export const refreshTokenAtom = atomWithStorage('raindrop_refresh_token', null);
export const tokenExpiryAtom = atomWithStorage('raindrop_token_expiry', null);

export const isAuthenticatedAtom = atom((get) => {
  const token = get(accessTokenAtom);
  const expiry = get(tokenExpiryAtom);

  if (!token || !expiry) return false;

  const fiveMinutesInMs = 5 * 60 * 1000;
  return Date.now() < expiry - fiveMinutesInMs;
});
