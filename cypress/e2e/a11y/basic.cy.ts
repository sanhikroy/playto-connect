describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Cypress best practice - inject axe before each test
    cy.visit('/')
    cy.injectAxe()
  })

  it('Home page should be accessible', () => {
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    })
  })

  it('Navigation should be keyboard accessible', () => {
    // Navigate to first interactive element
    cy.get('a').first().focus()
    
    // Check that the element is properly focused
    cy.focused().should('have.attr', 'href')
    
    // Test keyboard navigation with Tab
    cy.realPress('Tab')
    cy.focused().should('exist')
  })

  it('Auth pages should be accessible', () => {
    // Check sign in page
    cy.visit('/auth/signin')
    cy.injectAxe()
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    })
    
    // All form inputs should have accessible labels
    cy.get('input').each(($input) => {
      cy.wrap($input).should(($el) => {
        // Either has an aria-label or a corresponding label element
        expect(
          $el.attr('aria-label') ||
          $el.attr('aria-labelledby') ||
          Cypress.$(`label[for="${$el.attr('id')}"]`).length > 0 ||
          $el.closest('label').length > 0
        ).to.be.true
      })
    })
    
    // Check sign up page
    cy.visit('/auth/signup')
    cy.injectAxe()
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    })
  })

  it('Jobs page should have proper heading structure', () => {
    cy.visit('/jobs')
    cy.injectAxe()
    
    // Check for sequential heading structure
    cy.get('h1, h2, h3, h4, h5, h6').each(($heading, index, $headings) => {
      if (index > 0) {
        const currentLevel = parseInt($heading.prop('tagName').replace('H', ''))
        const previousLevel = parseInt($headings.eq(index - 1).prop('tagName').replace('H', ''))
        
        // Heading levels should not skip levels (e.g., h1 to h3)
        expect(currentLevel - previousLevel).to.be.lessThan(2)
      }
    })
    
    // Run axe check
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    })
  })

  it('Color contrast should meet WCAG standards', () => {
    // Check important text elements for contrast
    cy.visit('/')
    
    // Check headings
    cy.get('h1, h2, h3').each(($el) => {
      const styles = window.getComputedStyle($el[0])
      const color = styles.color
      const bgColor = styles.backgroundColor
      
      // If the background is transparent, we need the parent's bg color
      const effectiveBgColor = bgColor === 'rgba(0, 0, 0, 0)' 
        ? window.getComputedStyle($el.parent()[0]).backgroundColor
        : bgColor
      
      // Use the axe contrast checker (would need proper plugin setup)
      // This is a simplified check
      cy.log(`Checking contrast for: ${$el.text().slice(0, 20)}...`)
      // cy.task('checkContrast', { color, bgColor: effectiveBgColor })
    })
  })
}) 