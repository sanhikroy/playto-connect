import { ReactNode } from 'react'

export const metadata = {
  title: 'Connect - Authentication',
  description: 'Sign in or sign up to Connect and find the best talent or jobs.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
} 