import { useState, useEffect } from 'react';
import { httpAPI } from '../definitions';

interface BackendHealthStatus {
  isReady: boolean;
  isChecking: boolean;
  error: string | null;
  retryCount: number;
}

export const useBackendHealth = (
  healthUrl = `${httpAPI}/health`,
  maxRetries = 50,
  retryInterval = 1000
) => {
  const [status, setStatus] = useState<BackendHealthStatus>({
    isReady: false,
    isChecking: true,
    error: null,
    retryCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkHealth = async (attemptNumber: number) => {
      if (!isMounted) return;

      try {
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok && isMounted) {
          setStatus({
            isReady: true,
            isChecking: false,
            error: null,
            retryCount: attemptNumber,
          });
          return;
        }
      } catch (error) {
        console.log(`Backend health check failed (attempt ${attemptNumber}/${maxRetries})`);
      }

      // Retry logic
      if (attemptNumber < maxRetries && isMounted) {
        setStatus(prev => ({ ...prev, retryCount: attemptNumber }));
        timeoutId = setTimeout(() => checkHealth(attemptNumber + 1), retryInterval);
      } else if (isMounted) {
        setStatus({
          isReady: false,
          isChecking: false,
          error: 'Backend failed to start. Please restart the application.',
          retryCount: attemptNumber,
        });
      }
    };

    checkHealth(1);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [healthUrl, maxRetries, retryInterval]);

  return status;
};