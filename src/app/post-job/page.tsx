'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { pb } from '@/lib/pocketbase'
import { saveFormData, getFormData, clearFormData, STORAGE_KEYS } from '@/lib/utils/formStorage'
import { useToasts, ToastContainer } from '@/components/notifications/Toasts'
import JobForm, { JobFormData as FormData } from '@/components/forms/JobForm'

export default function PostJob() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const { toasts, addToast, removeToast } = useToasts()
  const [initialData, setInitialData] = useState<FormData | undefined>({
    title: '',
    description: '',
    requirements: '',
    role: '',
    isRemote: true,
    country: '',
    state: '',
    city: '',
    type: 'Full-time',
    salary: '',
    salaryCurrency: '$',
    salaryMin: '',
    salaryMax: '',
    salaryFrequency: 'annual',
    videos: ['', '', '', '', ''],
    assignment: '',
    status: 'Active'
  })

  // Load saved form data on initial render
  useEffect(() => {
    const savedFormData = getFormData(STORAGE_KEYS.JOB_POST)
    if (savedFormData) {
      setInitialData(savedFormData as FormData);
    }
  }, [])

  // Check URL params on load to see if we're continuing after authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get('continue') === 'true' && pb.authStore.isValid) {
        // User has authenticated and returned - submit the form automatically
        const savedForm = getFormData(STORAGE_KEYS.JOB_POST)
        if (savedForm) {
          submitJobPost(savedForm as FormData);
        }
      }
    }
  }, [])

  const saveFormState = (formData: FormData) => {
    try {
      saveFormData(STORAGE_KEYS.JOB_POST, formData)
    } catch (error) {
      console.error('Error saving form data:', error)
    }
  }

  const submitJobPost = async (formData: FormData) => {
    setIsSubmitting(true)
    setFormError('')
    
    try {
      // Check if user is authenticated
      if (!pb.authStore.isValid) {
        console.log('User not authenticated, saving form and redirecting to login')
        // Save form data for after login
        saveFormData(STORAGE_KEYS.JOB_POST, formData)
        
        // Redirect to login with return URL
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/post-job?continue=true')}`)
        return
      }
      
      // Get current user info
      const userData = pb.authStore.model
      
      // Prepare job data
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        role: formData.role,
        employer: userData?.id,
        location: formData.isRemote ? "Remote" : `${formData.city}, ${formData.state}, ${formData.country}`,
        is_remote: formData.isRemote,
        type: formData.type,
        salary: formData.salary,
        videos: formData.videos.filter(v => v.trim() !== ''),
        assignment: formData.assignment,
        status: formData.status
      }
      
      // Create job posting
      await pb.collection('jobs').create(jobData)
      
      // Clear saved form data
      clearFormData(STORAGE_KEYS.JOB_POST)

      // Show success message
      addToast('Your job has been posted and is now visible to talents.', 'success')
      
      // Redirect to dashboard
      router.push('/employer/dashboard')
    } catch (error) {
      console.error('Error posting job:', error)
      setFormError('Failed to post job. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="mb-10">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-2"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold tracking-tight text-white">Post a Job</h1>
          <p className="mt-2 text-gray-400">Create a new job posting to find the perfect talent for your project.</p>
            </div>

        {formError && (
          <div className="mb-6 rounded-md bg-red-500/10 p-4 text-sm text-red-400">
            {formError}
                  </div>
                )}

        <div className="bg-[#111] p-6 sm:p-8 rounded-xl shadow-lg ring-1 ring-white/10">
          <JobForm 
            initialData={initialData} 
            onSubmit={async (formData) => {
              // Save form state before submitting
              saveFormState(formData);
              await submitJobPost(formData);
            }}
            submitButtonLabel={isSubmitting ? "Posting..." : "Post Job"}
            isEmployer={true}
          />
        </div>
      </div>
      
      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
} 