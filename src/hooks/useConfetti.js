import { useCallback } from 'react';

const CONFETTI_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#10b981',
  '#f59e0b', '#06b6d4', '#ef4444', '#a855f7',
  '#14b8a6', '#f97316',
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/**
 * useConfetti — fires a burst of vibrant confetti particles
 */
export function useConfetti() {
  const fireConfetti = useCallback(() => {
    const container = document.getElementById('confetti-root');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < 80; i++) {
      const p = document.createElement('div');
      p.className = 'cp';
      const sz = 5 + Math.random() * 11;
      p.style.cssText = [
        `left:${Math.random() * 100}%`,
        `width:${sz}px`,
        `height:${sz}px`,
        `background:${rand(CONFETTI_COLORS)}`,
        `animation-duration:${2 + Math.random() * 3}s`,
        `animation-delay:${Math.random() * 1.2}s`,
        `border-radius:${Math.random() > 0.4 ? '50%' : '3px'}`,
        `opacity:0.9`,
      ].join(';');
      container.appendChild(p);
    }

    setTimeout(() => { container.innerHTML = ''; }, 6000);
  }, []);

  return { fireConfetti };
}
