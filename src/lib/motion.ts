/**
 * motion.ts — Centralized motion presets (Apple × Linear aesthetic)
 * Philosophy: purposeful, sparse, high-impact. No decoration spam.
 */
import type { Variants, Transition } from 'framer-motion';

// ── Spring configs ─────────────────────────────────────────────────────────
export const spring = {
  snappy:  { type: 'spring', stiffness: 400, damping: 30 } as Transition,
  smooth:  { type: 'spring', stiffness: 160, damping: 22 } as Transition,
  gentle:  { type: 'spring', stiffness: 80,  damping: 20 } as Transition,
  cinematic: { type: 'spring', stiffness: 60, damping: 18, mass: 1.2 } as Transition,
};

// ── Easing curves (Apple-style) ────────────────────────────────────────────
export const ease = {
  apple:   [0.25, 0.1, 0.25, 1.0]   as [number,number,number,number],
  out:     [0.0,  0.0, 0.2, 1.0]    as [number,number,number,number],
  inOut:   [0.4,  0.0, 0.2, 1.0]    as [number,number,number,number],
};

// ── Page entrance — cinematic zoom-in from slight scale ───────────────────
export const pageEnter: Variants = {
  hidden:  { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  visible: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: ease.out },
  },
  exit:    { opacity: 0, scale: 1.02, filter: 'blur(4px)',
    transition: { duration: 0.3, ease: ease.inOut },
  },
};

// ── Stagger container ──────────────────────────────────────────────────────
export const stagger = (delay = 0.1): Variants => ({
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: delay, delayChildren: 0.1 } },
});

// ── Individual items: slide-up + fade ─────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: spring.smooth },
};

// ── Zoom-in reveal (for hero text) ────────────────────────────────────────
export const zoomReveal: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: spring.cinematic },
};

// ── Slide from left ────────────────────────────────────────────────────────
export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: spring.smooth },
};

// ── Card hover props (use in whileHover) ──────────────────────────────────
export const cardHover = {
  rest:  { scale: 1,    y: 0,  boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  hover: { scale: 1.03, y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
    transition: spring.snappy,
  },
};

// ── Floating idle animation ────────────────────────────────────────────────
export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ── Viewport once config ───────────────────────────────────────────────────
export const inViewport = { once: true, margin: '-60px' };
