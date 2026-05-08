import { useEffect, useState } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() => globalThis.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mq = globalThis.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return { dark, setDark, toggle: () => setDark((d) => !d) };
}
