/**
 * Accessibility utility functions
 */

/**
 * Accessible hide utility - visually hide content but keep it accessible to screen readers
 */
export const srOnly = 'sr-only'

/**
 * Generate an ID safe for ARIA attributes
 * @param prefix - Prefix for the ID
 * @param suffix - Suffix for the ID
 * @returns A string ID safe for ARIA attributes
 */
export function generateAccessibleId(prefix: string, suffix: string | number = '') {
  return `${prefix.toLowerCase().replace(/\s+/g, '-')}-${suffix}`
}

/**
 * Skip navigation link props for keyboard accessibility
 */
export const skipNavProps = {
  href: '#main-content',
  className: 'sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-700 focus:text-white focus:z-50 focus:top-0 focus:left-0',
  children: 'Skip to main content',
  tabIndex: 0,
}

/**
 * Common ARIA attributes for interactive elements
 */
export const ariaAttributes = {
  /**
   * Attributes for a modal dialog
   */
  modal: {
    dialog: {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'modal-title',
    },
    closeButton: {
      'aria-label': 'Close',
    },
  },
  
  /**
   * Attributes for a dropdown menu
   */
  dropdown: {
    button: {
      'aria-haspopup': 'true',
      'aria-expanded': 'false', // Should be updated dynamically
    },
    menu: {
      role: 'menu',
    },
    item: {
      role: 'menuitem',
      tabIndex: -1, // Should be 0 for the focused item
    },
  },
  
  /**
   * Attributes for tabs
   */
  tabs: {
    tablist: {
      role: 'tablist',
    },
    tab: {
      role: 'tab',
      tabIndex: 0, // Should be 0 for the selected tab, -1 for others
      'aria-selected': 'true', // Should be true for the selected tab, false for others
    },
    tabpanel: {
      role: 'tabpanel',
      tabIndex: 0,
    },
  },
}

/**
 * Check if reduced motion is preferred
 * This should be used client-side only
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
} 