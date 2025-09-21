/**
 * Animation constants for consistent motion design across the application
 */

// Page transition animations
export const PAGE_TRANSITIONS = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: "easeInOut" }
} as const;

// Modal/Dialog animations
export const MODAL_TRANSITIONS = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
  transition: { duration: 0.2, ease: "easeOut" }
} as const;

// Sidebar animations
export const SIDEBAR_TRANSITIONS = {
  collapsed: { width: "4rem" },
  expanded: { width: "16rem" },
  transition: { duration: 0.3, ease: "easeInOut" }
} as const;

// Card hover animations
export const CARD_HOVER = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
} as const;

// Loading spinner animation
export const LOADING_SPIN = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" }
} as const;

// Stagger animation for lists
export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
} as const;

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
} as const;