'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCsrf } from '@/lib/hooks/useCsrf'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { csrfToken, loading: csrfLoading, error: csrfError, getHeaders } = useCsrf()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSuccess(false)

    // Don't proceed if CSRF token is not available
    if (!csrfToken) {
      setError('Security token not available. Please refresh the page.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred')
      }

      // Success - show success message
      setSuccess(true)
      setEmail('')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-white/10 rounded-xl sm:px-8">
            {csrfError && (
              <div className="mb-6 rounded-md bg-red-500/20 p-4 text-sm text-red-400">
                Security error: {csrfError}. Please refresh the page.
              </div>
            )}
            
            {error && (
              <div className="mb-6 rounded-md bg-red-500/20 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center">
                <div className="mb-6 rounded-md bg-green-500/20 p-4 text-sm text-green-400">
                  Password reset link sent! Check your email.
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  If you don&apos;t see the email, please check your spam folder.
                </p>
                <div className="mt-6">
                  <Link
                    href="/auth/signin"
                    className="flex w-full justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    Return to sign in
                  </Link>
                </div>
              </div>
            ) : (
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
                      className="block w-full rounded-md border-0 bg-white/5 py-2 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      placeholder="you@example.com"
                      disabled={csrfLoading || loading}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={csrfLoading || loading || !csrfToken}
                    className="flex w-full justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-70"
                  >
                    {csrfLoading ? 'Loading...' : loading ? 'Sending...' : 'Send reset link'}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <Link href="/auth/signin" className="text-sm text-blue-400 hover:text-blue-300">
                    Back to sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 