/// <reference types="cypress" />
/// <reference types="cypress-axe" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to inject axe-core into the page
     */
    injectAxe(): Chainable<void>;
    
    /**
     * Custom command to check accessibility with axe-core
     */
    checkA11y(
      context?: string | Node | null | undefined,
      options?: any,
      violationCallback?: (violations: any[]) => void,
      skipFailures?: boolean
    ): Chainable<void>;
    
    /**
     * Custom command to check if element is keyboard navigable
     */
    isKeyboardNavigable(selector: string): Chainable<void>;
    
    /**
     * Custom command to test color contrast
     */
    hasAdequateContrast(selector: string): Chainable<void>;
    
    /**
     * Custom command to check form inputs for accessible labels
     */
    hasAccessibleLabel(selector: string): Chainable<void>;
    
    /**
     * Custom command for keyboard tab navigation
     */
    tab(): Chainable<void>;
  }
} 