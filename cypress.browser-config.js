// Configuration for cross-browser testing

module.exports = {
  // Browser configurations for testing
  browsers: [
    {
      name: 'chrome',
      displayName: 'Chrome',
      family: 'chromium',
      channel: 'stable',
      displayVersion: '120',
    },
    {
      name: 'firefox',
      displayName: 'Firefox',
      family: 'firefox',
      channel: 'stable',
      displayVersion: '120',
    },
    {
      name: 'edge',
      displayName: 'Edge',
      family: 'chromium',
      channel: 'stable',
      displayVersion: '120',
    },
    {
      name: 'safari',
      displayName: 'Safari',
      family: 'webkit',
      version: '16.5',
    },
  ],
  
  // Mobile device configurations
  mobileDevices: [
    {
      name: 'iPhone 13',
      viewport: {
        width: 390,
        height: 844,
      },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    },
    {
      name: 'Samsung Galaxy S21',
      viewport: {
        width: 360,
        height: 800,
      },
      userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Mobile Safari/537.36',
    },
    {
      name: 'iPad Pro',
      viewport: {
        width: 1024,
        height: 1366,
      },
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    },
  ],
  
  // Test specific groups for compatibility testing
  testGroups: [
    {
      name: 'critical-path',
      specs: [
        'cypress/e2e/auth.cy.ts',
        'cypress/e2e/profile.cy.ts',
        'cypress/e2e/jobs.cy.ts'
      ],
    },
    {
      name: 'forms',
      specs: [
        'cypress/e2e/forms/**/*.cy.ts'
      ],
    },
    {
      name: 'accessibility',
      specs: [
        'cypress/e2e/a11y/**/*.cy.ts'
      ],
    },
  ],
  
  // Custom commands to run for each browser
  setupCommands: {
    // Commands for Chromium family (Chrome, Edge)
    chromium: [
      // Example browser-specific setup
      () => {
        cy.log('Running in Chromium-based browser')
        cy.window().then((win) => {
          win.localStorage.setItem('browser-family', 'chromium')
        })
      },
    ],
    // Commands for Firefox
    firefox: [
      () => {
        cy.log('Running in Firefox browser')
        cy.window().then((win) => {
          win.localStorage.setItem('browser-family', 'firefox')
        })
      },
    ],
    // Commands for WebKit family (Safari)
    webkit: [
      () => {
        cy.log('Running in WebKit-based browser')
        cy.window().then((win) => {
          win.localStorage.setItem('browser-family', 'webkit')
        })
      },
    ],
  },
} 