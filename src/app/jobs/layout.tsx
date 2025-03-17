import { ReactNode } from 'react'

export const metadata = {
  title: 'Connect - Jobs',
  description: 'Find the best jobs in the YouTube and content creation industry.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

interface JobsLayoutProps {
  children: ReactNode
}

export default function JobsLayout({ children }: JobsLayoutProps) {
  return (
    <div>
      {children}
    </div>
  )
} 