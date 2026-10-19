'use client';

import { useEffect } from 'react';
import { getAdminToken } from '../lib/api';

/**
 * Headless Admin Auth synchronizer.
 * Silently ensures the admin session is always authenticated in the background:
 * 1. Captures `?token=...` from URL redirects and saves to localStorage.
 * 2. If token is missing, automatically authenticates with the backend in the background.
 * No disruptive warning banners shown to the operator.
 */
export function AdminAuthSync() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check for token in URL query
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlUser = urlParams.get('user');

    if (urlToken) {
      localStorage.setItem('sripalie_token', urlToken);
      if (urlUser) localStorage.setItem('sripalie_user', urlUser);
      // Clean query parameter from URL bar
      window.history.replaceState({}, document.title, window.location.pathname);
      window.dispatchEvent(new Event('admin_auth_success'));
      return;
    }

    // 2. Automatically ensure admin token exists in background
    getAdminToken();
  }, []);

  return null;
}
