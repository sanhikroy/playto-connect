import { ReactNode } from 'react'

export const metadata = {
  title: 'Connect - Post a Job',
  description: 'Post a job listing to find the best talent for your YouTube channel or creative team.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

interface PostJobLayoutProps {
  children: ReactNode
}

export default function PostJobLayout({ children }: PostJobLayoutProps) {
  return (
    <div>
      {children}
    </div>
  )
} 