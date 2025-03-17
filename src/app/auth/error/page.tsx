'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  useEffect(() => {
    const error = searchParams.get('error')
    
    // Map error codes to human-readable messages
    const errorMessages: Record<string, string> = {
      'Configuration': 'There is a problem with the server configuration.',
      'AccessDenied': 'You do not have permission to sign in.',
      'Verification': 'The verification link is invalid or has expired.',
      'OAuthSignin': 'Error in the OAuth sign-in process.',
      'OAuthCallback': 'Error in the OAuth callback process.',
      'OAuthCreateAccount': 'Unable to create OAuth account.',
      'EmailCreateAccount': 'Unable to create email account.',
      'Callback': 'Error in the callback process.',
      'OAuthAccountNotLinked': 'This email is already associated with another account.',
      'EmailSignin': 'Error sending the email for sign in.',
      'CredentialsSignin': 'The email or password you entered is incorrect.',
      'SessionRequired': 'You must be signed in to access this page.',
      'Default': 'An error occurred during authentication.',
    }
    
    const message = error && errorMessages[error] 
      ? errorMessages[error] 
      : 'An unknown error occurred during authentication.'
    
    setErrorMessage(message)
  }, [searchParams])
  
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
            Authentication Error
          </h2>
        </div>
        
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-white/10 rounded-xl sm:px-8">
            <div className="mb-6 rounded-md bg-red-500/20 p-4 text-sm text-red-400">
              {errorMessage}
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link
                href="/auth/signin"
                className="flex w-full justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200"
              >
                Back to Sign In
              </Link>
              
              <Link
                href="/"
                className="flex w-full justify-center rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 