'use client';
import { useEffect, useRef } from 'react';
import { useApi } from '@/components/hooks';
import { removeClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';

export function LogoutPage() {
  const { post } = useApi();
  const logoutStarted = useRef(false);

  useEffect(() => {
    if (logoutStarted.current) {
      return;
    }

    logoutStarted.current = true;

    async function logout() {
      try {
        await post('/auth/logout');
      } catch {
        // The server session may already be expired or revoked.
      } finally {
        removeClientAuthToken();
        setUser(null);

        window.location.replace(`${process.env.basePath || ''}/login`);
      }
    }

    void logout();
  }, [post]);

  return null;
}
