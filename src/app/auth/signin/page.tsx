'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [callbackUrl, setCallbackUrl] = useState('')
  const { login, loginWithGoogle, isAuthenticated, user } = useAuth()

  // Check if user is already authenticated and get callback URL
  useEffect(() => {
    const callback = searchParams.get('callbackUrl')
    if (callback) {
      setCallbackUrl(callback)
    }

    // If user is already authenticated, redirect to dashboard or callback URL
    if (isAuthenticated) {
      if (callback) {
        router.push(callback)
      } else {
        // Redirect based on user role
        if (user?.role === 'EMPLOYER') {
          router.push('/employer/dashboard')
        } else {
          router.push('/talent/dashboard')
        }
      }
      return
    }
  }, [searchParams, router, isAuthenticated, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      
      // Successful login
      if (callbackUrl) {
        router.push(callbackUrl) // Redirect to the callback URL if provided
      }
      // AuthProvider will handle the default routing based on role
      router.refresh()
    } catch (error) {
      console.error('Login failed:', error)
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      await loginWithGoogle()
      // No need for routing logic here as Google auth will redirect to the callback URL
      // which will then handle routing based on the user's role
    } catch (error) {
      console.error('Google sign in failed:', error)
      setError('Google sign in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-white/10 rounded-xl sm:px-8">
            {error && (
              <div className="mb-4 rounded-md bg-red-500/20 p-4 text-sm text-red-400">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 p-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-blue-400 hover:text-blue-300">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 p-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[#111] px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 186.69 190.5">
                    <path fill="#4285f4" d="M95.25 77.932v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" />
                    <path fill="#34a853" d="M41.87 113.047l-6.849 5.302-24.258 18.684c15.577 30.883 47.762 52.118 85.219 52.118 25.716 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" />
                    <path fill="#fbbc05" d="M41.87 76.603c-3.24 9.599-5.054 19.815-5.054 30.446 0 10.631 1.814 20.847 5.054 30.446l31.107-23.986c-1.05-3.452-1.651-7.11-1.651-10.908 0-3.798.601-7.457 1.65-10.908z" />
                    <path fill="#ea4335" d="M95.25 47.927c16.625 0 28.689 7.19 35.328 13.183L155.95 35.42C139.203 19.477 118.988 10.5 95.25 10.5c-37.456 0-69.642 21.235-85.219 52.118l31.107 23.986c7.533-22.514 28.574-39.226 53.34-39.226z" />
                  </svg>
                  Google
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-semibold text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 