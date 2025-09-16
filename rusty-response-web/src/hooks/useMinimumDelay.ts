import { useCallback, useRef } from 'react';

export const useMinimumDelay = (minDelay: number = 500) => {
  const timerRef = useRef<number| null>(null);
  
  const withMinimumDelay = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      const startTime = Date.now();
      
      if (timerRef.current) clearTimeout(timerRef.current);

      const delayPromise = new Promise<void>((resolve) => {
        timerRef.current = setTimeout(() => {
          resolve();
        }, minDelay);
      });

      try {
        const [result] = await Promise.all([promise, delayPromise]);
        return result;
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minDelay - elapsedTime;

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    }, [minDelay]);

  return withMinimumDelay;
};