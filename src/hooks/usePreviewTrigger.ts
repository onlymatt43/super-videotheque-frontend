import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const usePreviewTrigger = (delayMs = 4000) => {
  const timerRef = useRef<number | null>(null);
  const { ref, inView } = useInView({ threshold: 0.6 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (inView) {
      timerRef.current = window.setTimeout(() => setReady(true), delayMs);
    } else {
      setReady(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [inView, delayMs]);

  return { ref, shouldPreview: ready };
};
