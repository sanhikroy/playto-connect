'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { pb } from '@/lib/pocketbase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // Handle OAuth callback or direct access
  useEffect(() => {
    console.log('Callback page loaded');
    console.log('URL params:', Object.fromEntries([...searchParams.entries()]));
    
    const processAuth = async () => {
      try {
        // Check if we have an OAuth code to exchange
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        
        // If we have code and state, try to exchange for token
        if (code && state) {
          console.log('Exchanging OAuth code for token');
          
          try {
            const authData = await pb.collection('users').authWithOAuth2Code(
              'google',
              code,
              state,
              `${window.location.origin}/auth/callback`
            )
            
            console.log('Auth successful:', authData);
            setUserId(authData.record.id);
          } catch (exchangeError) {
            console.error('Code exchange failed:', exchangeError);
            throw new Error('Failed to authenticate with Google');
          }
        } else if (pb.authStore.isValid && pb.authStore.model) {
          // We're already authenticated
          console.log('Already authenticated:', pb.authStore.model);
          setUserId(pb.authStore.model.id);
        } else {
          // No auth code and not authenticated
          throw new Error('No authentication parameters found');
        }
        
        setProcessing(false);
      } catch (error) {
        console.error('Auth processing error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setProcessing(false);
      }
    }
    
    processAuth();
  }, [searchParams]);

  // Handle role selection
  const handleRoleSelect = async (role: 'TALENT' | 'EMPLOYER') => {
    try {
      if (!userId && !pb.authStore.model?.id) {
        throw new Error('User ID not found. Please try signing in again.');
      }
      
      const id = userId || pb.authStore.model?.id;
      console.log(`Setting user ${id} role to ${role}`);
      setProcessing(true);
      
      const updatedUser = await pb.collection('users').update(id, {
        role: role
      });
      
      console.log('User updated with role:', updatedUser);
      
      // Redirect based on role
      if (role === 'EMPLOYER') {
        router.push('/employer/company/edit');
      } else {
        router.push('/talent/profile/edit');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      setError(error instanceof Error ? error.message : 'Failed to set role');
      setProcessing(false);
    }
  }

  // Show loading state
  if (processing) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="text-white mb-4">Processing your authentication...</div>
        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-red-500/20 rounded-xl sm:px-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-400 mb-4">Authentication Error</h2>
          <p className="text-white mb-6">{error}</p>
          <a href="/auth/signin" className="block w-full text-center rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20">
            Back to Sign In
          </a>
        </div>
      </div>
    )
  }

  // If we've passed all the checks, we need to show role selection
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="bg-[#111] px-6 py-8 shadow-md ring-1 ring-white/10 rounded-xl sm:px-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose your account type</h2>
        <p className="text-gray-400 mb-6 text-center">Select which type of account you want to create</p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('TALENT')}
            className="w-full flex items-center justify-center rounded-md bg-white/10 py-4 text-sm font-semibold text-white hover:bg-white/20"
          >
            I&apos;m a Talent looking for work
          </button>
          <button
            onClick={() => handleRoleSelect('EMPLOYER')}
            className="w-full flex items-center justify-center rounded-md bg-white/10 py-4 text-sm font-semibold text-white hover:bg-white/20"
          >
            I&apos;m an Employer looking to hire
          </button>
        </div>
      </div>
    </div>
  )
} 