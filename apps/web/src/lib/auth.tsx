import * as React from 'react';
import type { SessionUserDto } from '@gp/sdk';
import { api, ApiError } from './api';
import { tokens } from './tokens';
import { clearOutbox } from './offline';
import { clearPersistedCache } from './query';

interface AuthContextValue {
  user: SessionUserDto | null;
  loading: boolean;
  /**
   * True when the session was restored from cache because the device is offline.
   * Cached data renders, but nothing can be written until the session is renewed.
   */
  sessionStale: boolean;
  signIn: (email: string, password: string) => Promise<SessionUserDto>;
  register: (input: {
    email: string;
    password: string;
    givenName: string;
    familyName: string;
    mobile?: string;
  }) => Promise<SessionUserDto>;
  acceptInvitation: (token: string, password: string) => Promise<SessionUserDto>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUserDto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [sessionStale, setSessionStale] = React.useState(false);

  const adopt = React.useCallback((session: { accessToken: string; refreshToken: string; user: SessionUserDto }) => {
    tokens.setAccess(session.accessToken);
    tokens.setRefresh(session.refreshToken);
    tokens.setScope(session.user.id, session.user.practiceId);
    tokens.setLastSession(session.user);
    setUser(session.user);
    setSessionStale(false);
    return session.user;
  }, []);

  // Restore the session on load. A reception machine reloads all day.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const refreshToken = tokens.getRefresh();
      if (!refreshToken) {
        setLoading(false);
        return;
      }
      try {
        const session = await api.refreshSession({ refreshToken });
        if (!cancelled) adopt(session);
      } catch (error) {
        // Only a *rejected* token means signed out. Anything else — no network, a
        // 5xx, a proxy returning 502/504 because the API is down — should leave the
        // cached session in place so a GP on a home visit sees their data rather
        // than a login screen.
        const rejected =
          error instanceof ApiError && (error.status === 401 || error.status === 403);
        const cached = tokens.getLastSession() as SessionUserDto | null;
        if (!rejected && cached) {
          if (!cancelled) {
            setUser(cached);
            setSessionStale(true);
          }
        } else {
          tokens.clear();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [adopt]);

  const value: AuthContextValue = {
    user,
    loading,
    sessionStale,
    signIn: async (email, password) => adopt(await api.login({ email, password })),
    register: async (input) => adopt(await api.register(input)),
    acceptInvitation: async (token, password) =>
      adopt(await api.acceptInvitation({ token, password })),
    signOut: async () => {
      await api.logout().catch(() => {});
      tokens.clear();
      // Nothing cached survives sign-out.
      clearPersistedCache();
      await clearOutbox().catch(() => {});
      setUser(null);
      setSessionStale(false);
    },
    /**
     * Re-issues the access token as well as reloading the user.
     *
     * Practice membership is a claim inside the access token, so after creating a
     * practice the old token still says "no practice" and every scoped request
     * 404s. Refreshing the token is what actually fixes that; reloading the user
     * object alone is not enough.
     */
    refreshUser: async () => {
      const refreshToken = tokens.getRefresh();
      if (refreshToken) {
        const session = await api.refreshSession({ refreshToken });
        adopt(session);
        return;
      }
      const current = await api.getCurrentUser();
      tokens.setScope(current.id, current.practiceId);
      setUser(current);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

/** The practice id from the current session. Throws if used outside a practice. */
export function usePracticeId(): string {
  const { user } = useAuth();
  if (!user?.practiceId) throw new Error('No practice in the current session');
  return user.practiceId;
}
