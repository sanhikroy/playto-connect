import { getSecret, generateToken, verifyToken } from './csrf'

describe('CSRF Protection', () => {
  beforeEach(() => {
    // Reset module state between tests
    jest.resetModules()
  })

  it('should generate a consistent secret', async () => {
    const secret1 = await getSecret()
    const secret2 = await getSecret()
    
    expect(secret1).toBeTruthy()
    expect(secret2).toBeTruthy()
    // Same secret should be returned on subsequent calls
    expect(secret1).toBe(secret2)
  })

  it('should generate valid tokens', async () => {
    const token = await generateToken()
    
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(10)
  })

  it('should verify valid tokens correctly', async () => {
    const token = await generateToken()
    const isValid = await verifyToken(token)
    
    expect(isValid).toBe(true)
  })
  
  it('should reject invalid tokens', async () => {
    const invalidToken = 'invalid-token'
    const isValid = await verifyToken(invalidToken)
    
    expect(isValid).toBe(false)
  })
}) 