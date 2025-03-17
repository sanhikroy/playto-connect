// Load cypress-axe for accessibility testing
import 'cypress-axe'
// No need to import index.d.ts, it gets used automatically

// Custom command for tabbing
Cypress.Commands.add('tab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9 })
})

// Command to check if element is keyboard navigable
Cypress.Commands.add('isKeyboardNavigable', (selector) => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9 }).then(() => {
    cy.focused().should('match', selector)
  })
})

// Command to test color contrast
Cypress.Commands.add('hasAdequateContrast', (selector) => {
  cy.get(selector).then($el => {
    cy.task('verifyContrast', {
      foregroundColor: window.getComputedStyle($el[0]).color,
      backgroundColor: window.getComputedStyle($el[0]).backgroundColor,
      minRatio: 4.5 // WCAG AA standard
    }).should('be.true')
  })
})

// Command to check form inputs for accessible labels
Cypress.Commands.add('hasAccessibleLabel', (selector) => {
  cy.get(selector).then($el => {
    const id = $el.attr('id')
    if (id) {
      // Check for label with matching 'for' attribute
      cy.get(`label[for="${id}"]`).should('exist')
    } else {
      // Check if input is wrapped in a label
      cy.wrap($el).parent('label').should('exist')
    }
  })
})

// Add TypeScript definitions
declare global {
  namespace Cypress {
    interface Chainable {
      checkA11y: (context?: string | null, options?: any) => void
      isKeyboardNavigable: (selector: string) => void
      hasAdequateContrast: (selector: string) => void
      hasAccessibleLabel: (selector: string) => void
    }
  }
} 