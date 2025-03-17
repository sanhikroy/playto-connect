const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/cypress/',
  ],
  // Only run *.test.ts or *.test.tsx files
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(tsx?|ts?)$',
  // Exclude cypress from test coverage
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig) 