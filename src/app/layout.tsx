import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ReactNode } from 'react'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

export const metadata = {
  title: 'Connect - Find & Hire YouTube Talent',
  description: 'Connect with top YouTube talent or find your next opportunity in content creation.',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-[#0A0A0A] relative">
              <div 
                className="absolute inset-0 -z-10 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(0, 0, 255, 0.3), transparent 70%)',
                }}
              />
              <Navigation />
              {children}
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}
