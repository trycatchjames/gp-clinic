import { GpApiClient, ApiError } from '@gp/sdk';
import { tokens } from './tokens';

/**
 * Operation paths in the generated SDK already carry the API's global prefix
 * (`/api/...`), so this is the origin only. Empty means same-origin, which is what
 * the Vite dev proxy and a single-origin deployment both want.
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * One client for the whole app. Nothing calls fetch() directly — every request
 * goes through the generated SDK, so the API contract is enforced at compile time.
 */
export const api = new GpApiClient({
  baseUrl: BASE_URL,
  getAccessToken: () => tokens.getAccess(),
  onUnauthorized: async () => {
    const refreshToken = tokens.getRefresh();
    if (!refreshToken) return null;
    try {
      // Refresh through a bare client so a failing refresh cannot recurse.
      const bare = new GpApiClient({ baseUrl: BASE_URL });
      const result = await bare.refreshSession({ refreshToken });
      tokens.setAccess(result.accessToken);
      tokens.setRefresh(result.refreshToken);
      return result.accessToken;
    } catch {
      tokens.clear();
      return null;
    }
  },
});

export { ApiError };

/** Turns an API failure into something worth showing a user. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.problem.detail ?? error.problem.title ?? 'Something went wrong.';
  }
  if (error instanceof TypeError) {
    return 'Could not reach the server. Your changes are saved locally and will sync when you reconnect.';
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
}

/** Field-level messages for a form, keyed by field name. */
export function fieldErrors(error: unknown): Record<string, string> {
  return error instanceof ApiError ? error.fieldErrors : {};
}
