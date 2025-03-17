'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
          <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-white/10 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              An error occurred while rendering this page. Please try refreshing or contact support if the problem persists.
            </p>
            <div className="bg-red-500/10 p-4 rounded-md mb-6 overflow-auto max-h-32">
              <pre className="text-xs text-red-400">
                {this.state.error?.toString() || 'Unknown error'}
              </pre>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="w-full justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 