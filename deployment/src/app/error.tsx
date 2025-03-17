'use client'

import { useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <html>
      <body>
        <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
          <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-white/10 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Something went wrong!</h2>
            <p className="text-gray-400 mb-6">
              An unexpected error occurred on the server. Our team has been notified.
            </p>
            {error.message && (
              <div className="bg-red-500/10 p-4 rounded-md mb-6 overflow-auto max-h-32">
                <pre className="text-xs text-red-400">
                  {error.message}
                </pre>
              </div>
            )}
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => reset()}
                className="w-full justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200"
              >
                Try again
              </button>
              <Link
                href="/"
                className="flex w-full justify-center rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
} 