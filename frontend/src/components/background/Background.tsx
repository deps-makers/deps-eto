import { useEffect, useRef } from 'react';

const COLOR_DEFS_LIGHT: { varName: string; alpha: number }[] = [
  { varName: '--color-primary-100', alpha: 0.35 },
  { varName: '--color-primary-200', alpha: 0.35 },
  { varName: '--color-primary-300', alpha: 0.35 },
  { varName: '--color-primary-400', alpha: 0.35 },
  { varName: '--color-primary-500', alpha: 0.35 },
  { varName: '--color-primary-600', alpha: 0.35 },
  { varName: '--color-primary-700', alpha: 0.35 },
  { varName: '--color-neutral-100', alpha: 0.35 },
  { varName: '--color-neutral-200', alpha: 0.35 },
  { varName: '--color-neutral-300', alpha: 0.35 },
  { varName: '--color-neutral-400', alpha: 0.35 },
  { varName: '--color-neutral-500', alpha: 0.35 },
  { varName: '--color-neutral-600', alpha: 0.35 },
  { varName: '--color-neutral-700', alpha: 0.35 },
];

const COLOR_DEFS_DARK: { varName: string; alpha: number }[] = [
  { varName: '--color-primary-900', alpha: 0.35 },
  { varName: '--color-primary-800', alpha: 0.35 },
  { varName: '--color-primary-700', alpha: 0.35 },
  { varName: '--color-primary-600', alpha: 0.35 },
  { varName: '--color-primary-500', alpha: 0.35 },
  { varName: '--color-primary-400', alpha: 0.35 },
  { varName: '--color-primary-300', alpha: 0.35 },
  { varName: '--color-neutral-900', alpha: 0.35 },
  { varName: '--color-neutral-800', alpha: 0.35 },
  { varName: '--color-neutral-700', alpha: 0.35 },
  { varName: '--color-neutral-600', alpha: 0.35 },
  { varName: '--color-neutral-500', alpha: 0.35 },
  { varName: '--color-neutral-400', alpha: 0.35 },
  { varName: '--color-neutral-300', alpha: 0.35 },
];

type ResolvedColor = { hex: string; alpha: number };

const resolveColors = (defs: { varName: string; alpha: number }[]): ResolvedColor[] => {
  const style = getComputedStyle(document.documentElement);
  return defs
    .map(({ varName, alpha }) => ({
      hex: style.getPropertyValue(varName).trim(),
      alpha,
    }))
    .filter((c) => c.hex !== '');
};

interface Diamond {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
  filled: boolean;
  lineWidth: number;
}

const rand = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const pickRandom = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const createDiamond = (canvasW: number, canvasH: number, colors: ResolvedColor[]): Diamond => {
  const palette = pickRandom(colors);

  const filled = Math.random() > 0.35;
  const size = filled ? rand(20, 60) : rand(20, 80);

  return {
    x: rand(0, canvasW),
    y: rand(-canvasH * 0.1, canvasH * 1.1),
    size,
    speed: rand(0.05, 0.2) * (Math.random() > 0.5 ? -1 : 1),
    color: palette.hex,
    alpha: filled ? palette.alpha : palette.alpha * 0.8,
    filled,
    lineWidth: filled ? 0 : rand(1, 2),
  };
};

function densityForWidth(w: number): number {
  if (w < 600) return 0.000045;
  if (w < 1200) return 0.000055;
  return 0.000058;
}

const darkModeQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');

function isDarkMode(): boolean {
  return darkModeQuery.matches;
}

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const diamonds = useRef<Diamond[]>([]);
  const rafId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let w = 0;
    let h = 0;

    const regenerate = () => {
      const dark = isDarkMode();

      const defs = dark ? COLOR_DEFS_DARK : COLOR_DEFS_LIGHT;
      const bgVar = dark ? '--color-primary-950' : '--color-primary-50';
      const colors = resolveColors(defs);

      const count = Math.max(20, Math.round(w * h * densityForWidth(w)));
      diamonds.current = Array.from({ length: count }, () => createDiamond(w, h, colors));

      canvas.style.background = getComputedStyle(document.documentElement).getPropertyValue(bgVar).trim();
      console.log(getComputedStyle(document.documentElement).getPropertyValue(bgVar).trim());
    };

    const resize = () => {
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      regenerate();
    };

    resize();
    window.addEventListener('resize', resize);

    const onThemeChange = () => regenerate();
    darkModeQuery.addEventListener('change', onThemeChange);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const d of diamonds.current) {
        d.y += d.speed;

        const pad = d.size + 4;
        if (d.speed < 0 && d.y < -pad) d.y = h + pad;
        if (d.speed > 0 && d.y > h + pad) d.y = -pad;

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(Math.PI / 4);
        ctx.globalAlpha = d.alpha;

        if (d.filled) {
          ctx.fillStyle = d.color;
          ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size);
        } else {
          ctx.strokeStyle = d.color;
          ctx.lineWidth = d.lineWidth;
          ctx.strokeRect(-d.size / 2, -d.size / 2, d.size, d.size);
        }

        ctx.restore();
      }

      rafId.current = requestAnimationFrame(draw);
    };

    rafId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
      darkModeQuery.removeEventListener('change', onThemeChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Background;
