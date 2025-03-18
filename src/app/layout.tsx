import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ReactNode } from 'react'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { MonitoringProvider } from '@/components/providers/MonitoringProvider'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Connect - Find & Hire YouTube Talent',
  description: 'Connect with top YouTube talent or find your next opportunity in content creation.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <MonitoringProvider>
            <ErrorBoundary>
              <div className="min-h-screen bg-[#0A0A0A]">
                <Navigation />
                {children}
              </div>
            </ErrorBoundary>
          </MonitoringProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
