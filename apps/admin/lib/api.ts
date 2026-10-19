// apps/admin/lib/api.ts

let tokenPromise: Promise<string | null> | null = null;

/**
 * Returns the current admin JWT token from localStorage, or automatically
 * authenticates with the default admin credentials in the background.
 */
export async function getAdminToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const existingToken = localStorage.getItem('sripalie_token');
  if (existingToken) {
    return existingToken;
  }

  // Deduplicate simultaneous login requests
  if (!tokenPromise) {
    tokenPromise = (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@sripalie.com', password: 'admin123' }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('sripalie_token', data.token);
            if (data.user) {
              localStorage.setItem('sripalie_user', JSON.stringify(data.user));
            }
            // Dispatch event so all components know we are authenticated
            window.dispatchEvent(new Event('admin_auth_success'));
            return data.token;
          }
        }
      } catch (err) {
        console.error('[Admin API] Auto-authentication error:', err);
      } finally {
        tokenPromise = null;
      }
      return null;
    })();
  }

  return tokenPromise;
}

/**
 * Enhanced fetch wrapper for Admin API calls.
 * Automatically injects the Authorization header, and if a 401 is received,
 * silently refreshes the admin token and retries the request once.
 */
export async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  let token = await getAdminToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(url, { ...options, headers });

  // If 401 Unauthorized, automatically renew token and retry once
  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('sripalie_token');
    token = await getAdminToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      res = await fetch(url, { ...options, headers });
    }
  }

  return res;
}
