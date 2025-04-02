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
  signup: (name: string, email: string, password: string, role: 'TALENT' | 'EMPLOYER') => Promise<'TALENT' | 'EMPLOYER'>
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
      console.log('Starting Google authentication flow');
      
      // Use PocketBase's OAuth2
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('Using redirect URL:', redirectUrl);
      
      const authData = await pb.collection('users').authWithOAuth2({ 
        provider: 'google',
        redirectUrl: redirectUrl
      });
      
      // This line should only execute if we're not redirected
      console.log('Auth data received:', authData);
      
      // If we got a URL, redirect
      if (typeof authData === 'object' && 'authUrl' in authData) {
        console.log('Redirecting to:', authData.authUrl);
        if (typeof authData.authUrl === 'string') {
          window.location.href = authData.authUrl;
        }
      } else {
        // We're already authenticated
        console.log('Already authenticated with Google');
        
        // Set user if we have record data
        if ('record' in authData) {
          setUser({
            id: authData.record.id,
            email: authData.record.email,
            name: authData.record.name,
            role: authData.record.role
          });
          
          // If user already has a role, redirect them to their dashboard
          if (authData.record.role && authData.record.role !== '') {
            console.log('User already has role:', authData.record.role);
            // Redirect to the appropriate dashboard based on role
            if (authData.record.role === 'EMPLOYER') {
              router.push('/employer/dashboard');
            } else {
              router.push('/talent/dashboard');
            }
          } else {
            // If user does not have a role, send to role selection
            console.log('User needs to select a role');
            router.push('/auth/callback');
          }
        }
      }
    } catch (error) {
      console.error('Google login failed - detailed error:', error);
      throw error;
    }
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    router.push('/auth/signin')
  }

  const signup = async (name: string, email: string, password: string, role: 'TALENT' | 'EMPLOYER') => {
    try {
      // Create the user with PocketBase
      await pb.collection('users').create({
        name,
        email,
        password,
        passwordConfirm: password,
        role
      })

      // Automatically sign in after registration
      await login(email, password)
      
      // Return the role for redirect handling in the component
      return role
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 