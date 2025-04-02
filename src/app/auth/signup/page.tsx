'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'TALENT' | 'EMPLOYER'>('TALENT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup, loginWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      // Use the signup function from AuthProvider
      const userRole = await signup(name, email, password, role)
      
      // Redirect based on role
      if (userRole === 'TALENT') {
        router.push('/talent/complete-profile')
      } else {
        router.push('/employer/complete-profile')
      }
      
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred during registration')
      }
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      // Redirect to the Google authentication page
      await loginWithGoogle()
      // The loginWithGoogle function will handle the redirect
    } catch (error) {
      console.error('Google sign up failed:', error)
      setError('Google sign up failed. Please try again.')
    }
  }
  
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
            Create your account
          </h2>
        </div>
        
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-white/10 rounded-xl sm:px-8">
            {error && (
              <div className="mb-6 rounded-md bg-red-500/20 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignUp}
              className="mb-6 flex w-full items-center justify-center gap-3 rounded-md bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 186.69 190.5">
                <path fill="#4285f4" d="M95.25 77.932v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" />
                <path fill="#34a853" d="M41.87 113.047l-6.849 5.302-24.258 18.684c15.577 30.883 47.762 52.118 85.219 52.118 25.716 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" />
                <path fill="#fbbc05" d="M41.87 76.603c-3.24 9.599-5.054 19.815-5.054 30.446 0 10.631 1.814 20.847 5.054 30.446l31.107-23.986c-1.05-3.452-1.651-7.11-1.651-10.908 0-3.798.601-7.457 1.65-10.908z" />
                <path fill="#ea4335" d="M95.25 47.927c16.625 0 28.689 7.19 35.328 13.183L155.95 35.42C139.203 19.477 118.988 10.5 95.25 10.5c-37.456 0-69.642 21.235-85.219 52.118l31.107 23.986c7.533-22.514 28.574-39.226 53.34-39.226z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#111] px-2 text-gray-400">or</span>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-300">
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-2 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
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
                    className="block w-full rounded-md border-0 bg-white/5 py-2 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-2 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-300">
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-2 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-300">
                  I am a...
                </label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('TALENT')}
                    className={`flex items-center justify-center rounded-md py-2.5 text-sm font-semibold ${
                      role === 'TALENT'
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Talent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('EMPLOYER')}
                    className={`flex items-center justify-center rounded-md py-2.5 text-sm font-semibold ${
                      role === 'EMPLOYER'
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Employer
                  </button>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-70"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[#111] px-2 text-gray-400">Already have an account?</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/auth/signin"
                  className="flex w-full justify-center rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 