'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface RequireAuthProps {
  children: ReactNode
  requiredRole?: 'TALENT' | 'EMPLOYER'
}

export function RequireAuth({ children, requiredRole }: RequireAuthProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      // Session is still loading, do nothing yet
      return
    }

    if (status === 'unauthenticated') {
      // User is not authenticated, redirect to sign in
      router.push('/auth/signin')
      return
    }

    if (requiredRole && session?.user?.role !== requiredRole) {
      // User doesn't have the required role, redirect to error page
      router.push(`/auth/error?error=AccessDenied`)
    }
  }, [status, session, router, requiredRole])

  if (status === 'loading') {
    // Show loading state
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    // Don't render children if not authenticated
    return null
  }

  if (requiredRole && session?.user?.role !== requiredRole) {
    // Don't render children if role doesn't match
    return null
  }

  // User is authenticated and has the required role (if specified)
  return <>{children}</>
} 