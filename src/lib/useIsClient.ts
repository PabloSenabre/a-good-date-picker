import { useEffect, useState } from 'react';

/**
 * Hook to check if code is running on client-side
 * Helps prevent hydration mismatches in SSR
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
