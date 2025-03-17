import { useState, useEffect } from 'react'

type ToastProps = {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }[type]

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg transition-opacity ${bgColor} animate-fade-in-up`}
      role="alert"
    >
      <p>{message}</p>
    </div>
  )
}

type ToastContainerProps = {
  toasts: Array<{
    id: string
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
  }>
  removeToast: (id: string) => void
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useToasts() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
  }>>([])

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return { toasts, addToast, removeToast }
} 