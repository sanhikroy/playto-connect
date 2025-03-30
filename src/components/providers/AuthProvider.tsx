'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { pb } from '@/lib/pocketbase'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    if (pb.authStore.isValid && pb.authStore.model) {
      setUser({
        id: pb.authStore.model.id,
        email: pb.authStore.model.email,
        name: pb.authStore.model.name,
        role: pb.authStore.model.role
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password)
      setUser({
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        role: authData.record.role
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
      setUser({
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        role: authData.record.role
      })
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    router.push('/auth/signin')
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 