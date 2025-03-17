/**
 * Email service for sending various types of emails
 * In a production app, you would use a service like SendGrid, Mailgun, etc.
 */

/**
 * Sends a password reset email with a link to reset the password
 * @param email The recipient's email address
 * @param resetUrl The URL for resetting the password
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
  // In a real application, you would send an actual email here
  // For this example, we'll just log the reset link to the console
  console.log(`
    =============================
    Password Reset Link for ${email}:
    ${resetUrl}
    =============================
  `)
  
  // Simulating successful email sending
  return true
} 