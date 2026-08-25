/**
 * Token storage.
 *
 * The access token stays in memory only. The refresh token is persisted so a page
 * reload does not sign the user out — a practice reception machine reloads all day.
 * Everything cached for a user is namespaced by user id and cleared on sign-out.
 */
const REFRESH_KEY = 'gp.refreshToken';
const SCOPE_KEY = 'gp.scope';
const LAST_SESSION_KEY = 'gp.lastSession';

let accessToken: string | null = null;

export const tokens = {
  getAccess: () => accessToken,
  setAccess: (token: string | null) => {
    accessToken = token;
  },

  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setRefresh: (token: string | null) => {
    if (token) localStorage.setItem(REFRESH_KEY, token);
    else localStorage.removeItem(REFRESH_KEY);
  },

  /** Namespaces cached data so a shared front-desk machine cannot leak between users. */
  getScope: () => localStorage.getItem(SCOPE_KEY),
  setScope: (userId: string | null | undefined, practiceId: string | null | undefined) => {
    if (userId) localStorage.setItem(SCOPE_KEY, `${userId}:${practiceId ?? 'none'}`);
    else localStorage.removeItem(SCOPE_KEY);
  },

  /**
   * The last known session user, kept so the app can still render cached data when
   * it starts up with no connection. It is not a credential — without a valid
   * access token no request will succeed, so this only unlocks the cached views.
   */
  getLastSession: (): unknown | null => {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setLastSession: (user: unknown | null) => {
    if (user) localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(LAST_SESSION_KEY);
  },

  clear: () => {
    accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(SCOPE_KEY);
    localStorage.removeItem(LAST_SESSION_KEY);
  },
};
