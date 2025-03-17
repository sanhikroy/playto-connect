describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset database or API state if needed
    // cy.task('db:reset') // Example if you set up a task
    cy.visit('/')
  })

  it('should navigate to sign in page', () => {
    // Find and click sign in link
    cy.contains('Sign in').click()
    
    // Should be on sign in page
    cy.url().should('include', '/auth/signin')
    
    // Should have email and password fields
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
  })

  it('should navigate to sign up page', () => {
    // Find and click sign up link
    cy.contains('Sign up').click()
    
    // Should be on sign up page
    cy.url().should('include', '/auth/signup')
    
    // Should have name, email, password fields and role selection
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="confirmPassword"]').should('be.visible')
  })

  it('should show validation errors on sign in form', () => {
    cy.visit('/auth/signin')
    
    // Submit empty form
    cy.get('form').submit()
    
    // Should show validation errors
    cy.contains('required').should('be.visible')
  })

  it('should show validation errors on sign up form', () => {
    cy.visit('/auth/signup')
    
    // Submit empty form
    cy.get('form').submit()
    
    // Should show validation errors
    cy.contains('required').should('be.visible')
  })

  // Example of a full sign-up and sign-in flow
  // Note: This would normally be in a separate file and would handle cleanup
  it('should allow a user to sign up and sign in', () => {
    const testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!'
    }
    
    // Sign up
    cy.visit('/auth/signup')
    cy.get('input[name="name"]').type(testUser.name)
    cy.get('input[name="email"]').type(testUser.email)
    cy.get('input[name="password"]').type(testUser.password)
    cy.get('input[name="confirmPassword"]').type(testUser.password)
    
    // Select talent role
    cy.get('input[value="TALENT"]').check()
    
    // Submit form - Note: In real tests we would intercept API requests
    cy.get('form').submit()
    
    // Should redirect to talent profile completion
    cy.url().should('include', '/talent/complete-profile')
    
    // Sign out
    cy.contains('Sign out').click()
    
    // Sign back in
    cy.visit('/auth/signin')
    cy.get('input[name="email"]').type(testUser.email)
    cy.get('input[name="password"]').type(testUser.password)
    cy.get('form').submit()
    
    // Should redirect to talent dashboard
    cy.url().should('include', '/talent/dashboard')
  })
}) 