'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { saveFormData, getFormData, clearFormData, STORAGE_KEYS } from '@/lib/utils/formStorage'
import { useToasts, ToastContainer } from '@/components/notifications/Toasts'

interface LocationData {
  states: {
    [country: string]: string[];
  };
  cities: {
    [state: string]: string[];
  };
}

interface JobPost {
  id: string;
  role: string;
  company: string;
  website?: string;
  social?: string;
  isRemote: boolean;
  location?: {
    country: string;
    state?: string;
    city?: string;
  };
  jobType: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  videos: string[];
  createdAt: string;
}

// Define a type for the form data
interface JobFormData {
  role: string;
  company: string;
  website: string;
  social: string;
  jobType: string;
  isRemote: boolean;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  type: string;
  currency: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  [key: string]: any; // Allow for dynamic video keys
}

export default function PostJob() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [jobType, setJobType] = useState('Full-time')
  const [isRemote, setIsRemote] = useState(true)
  const [currency, setCurrency] = useState('USD')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [formError, setFormError] = useState('') // General form error
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [redirectToAuth, setRedirectToAuth] = useState(false)
  
  // Add error states
  const [errors, setErrors] = useState({
    role: '',
    company: '',
    website: '',
    social: '',
    country: '',
    state: '',
    city: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    videos: ['', '', '', '', '']
  })

  const { toasts, addToast, removeToast } = useToasts()

  // Load saved form data on initial render
  useEffect(() => {
    const savedFormData = getFormData(STORAGE_KEYS.JOB_POST)
    if (savedFormData) {
      // Restore form state from saved data
      if (savedFormData.jobType) setJobType(savedFormData.jobType)
      if (savedFormData.isRemote !== undefined) setIsRemote(savedFormData.isRemote)
      if (savedFormData.currency) setCurrency(savedFormData.currency)
      if (savedFormData.selectedCountry) setSelectedCountry(savedFormData.selectedCountry)
      if (savedFormData.selectedState) setSelectedState(savedFormData.selectedState)
      if (savedFormData.selectedCity) setSelectedCity(savedFormData.selectedCity)
      
      // Restore form field values by setting them directly in the DOM
      // This will be done after the component mounts
      setTimeout(() => {
        const formFields = [
          'role', 'company', 'website', 'social', 'type', 'salaryMin', 'salaryMax', 'description'
        ]
        
        formFields.forEach(field => {
          const element = document.getElementsByName(field)[0] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          if (element && savedFormData[field]) {
            element.value = savedFormData[field]
          }
        })
        
        // Restore video URLs
        for (let i = 1; i <= 5; i++) {
          const videoField = document.getElementsByName(`video${i}`)[0] as HTMLInputElement
          if (videoField && savedFormData[`video${i}`]) {
            videoField.value = savedFormData[`video${i}`]
          }
        }
      }, 100)
    }
  }, [])

  // Handle redirect after form completion if user is not authenticated
  useEffect(() => {
    if (redirectToAuth && status !== 'loading') {
      // Form data is already saved at this point
      // Redirect to sign in page with callback URL
      const callbackUrl = `/post-job?continue=true`
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }
  }, [redirectToAuth, status, router])

  // Check URL params on load to see if we're continuing after authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get('continue') === 'true' && status === 'authenticated') {
        // User has authenticated and returned - submit the form automatically
        const savedForm = getFormData(STORAGE_KEYS.JOB_POST)
        if (savedForm) {
          submitJobPost(savedForm)
        }
      }
    }
  }, [status])

  const countries = [
    'Australia',
    'Brazil',
    'Canada',
    'China',
    'France',
    'Germany',
    'India',
    'Italy',
    'Japan',
    'Netherlands',
    'Singapore',
    'Spain',
    'United Kingdom',
    'United States'
  ].sort()

  const states: LocationData['states'] = {
    'United States': [
      'Alabama',
      'Alaska',
      'Arizona',
      'California',
      'Colorado',
      'Florida',
      'Georgia',
      'Illinois',
      'Massachusetts',
      'Michigan',
      'New York',
      'North Carolina',
      'Ohio',
      'Pennsylvania',
      'Texas',
      'Virginia',
      'Washington'
    ],
    'United Kingdom': [
      'England',
      'Scotland',
      'Wales',
      'Northern Ireland'
    ],
    'Germany': [
      'Baden-Württemberg',
      'Bavaria',
      'Berlin',
      'Brandenburg',
      'Bremen',
      'Hamburg',
      'Hesse',
      'Lower Saxony',
      'North Rhine-Westphalia',
      'Rhineland-Palatinate',
      'Saxony',
      'Thuringia'
    ],
    'India': [
      'Andhra Pradesh',
      'Delhi',
      'Gujarat',
      'Karnataka',
      'Maharashtra',
      'Tamil Nadu',
      'Telangana',
      'Uttar Pradesh',
      'West Bengal'
    ],
    'Canada': [
      'Alberta',
      'British Columbia',
      'Ontario',
      'Quebec'
    ],
    'Australia': [
      'New South Wales',
      'Queensland',
      'South Australia',
      'Victoria',
      'Western Australia'
    ]
  }

  const cities: LocationData['cities'] = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    'Texas': ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'],
    'Bavaria': ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Würzburg'],
    'Berlin': ['Berlin'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Wagga Wagga'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton']
  }

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    setSelectedState('')
    setSelectedCity('')
  }, [selectedCountry])

  useEffect(() => {
    setSelectedCity('')
  }, [selectedState])

  const roles = [
    'Video Editor',
    'Creative Director',
    'Thumbnail Designer',
    'Channel Manager',
    'Content Strategist',
    'Scriptwriter',
    'Channel Producer',
    'Motion Designer',
    'Sound Designer',
    'Social Media Manager',
    'Video Marketing Specialist',
    'Content Researcher',
    'YouTube SEO Specialist'
  ]

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'COP', symbol: '$', name: 'Colombian Peso' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu' }
  ].sort((a, b) => a.code.localeCompare(b.code))

  // Validation functions
  const validateUrl = (url: string) => {
    if (!url) return true // Empty URLs are valid (optional fields)
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateSalary = (min: string, max: string) => {
    const minVal = parseFloat(min)
    const maxVal = parseFloat(max)
    if (min && isNaN(minVal)) return 'Must be a number'
    if (max && isNaN(maxVal)) return 'Must be a number'
    if (minVal && maxVal && minVal > maxVal) return 'Minimum salary cannot be greater than maximum'
    if (minVal < 0 || maxVal < 0) return 'Salary cannot be negative'
    return ''
  }

  const handleInputChange = (field: string, value: string) => {
    let error = ''

    switch (field) {
      case 'company':
        if (!value.trim()) error = 'Company name is required'
        else if (value.length < 2) error = 'Company name must be at least 2 characters'
        break
      case 'website':
        if (value && !validateUrl(value)) error = 'Please enter a valid URL'
        break
      case 'social':
        if (value && !validateUrl(value)) error = 'Please enter a valid URL'
        break
      case 'description':
        if (!value.trim()) error = 'Job description is required'
        else if (value.length < 100) error = 'Description must be at least 100 characters'
        break
    }

    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleVideoChange = (index: number, value: string) => {
    if (value && !validateUrl(value)) {
      setErrors(prev => {
        const newVideoErrors = [...prev.videos]
        newVideoErrors[index] = 'Please enter a valid URL'
        return { ...prev, videos: newVideoErrors }
      })
    } else {
      setErrors(prev => {
        const newVideoErrors = [...prev.videos]
        newVideoErrors[index] = ''
        return { ...prev, videos: newVideoErrors }
      })
    }
  }

  const handleSalaryChange = (min: string, max: string) => {
    const error = validateSalary(min, max)
    setErrors(prev => ({ ...prev, salaryMin: error, salaryMax: error }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }
    
    // Check role
    const roleValue = (document.getElementsByName('role')[0] as HTMLSelectElement).value
    if (!roleValue) {
      newErrors.role = 'Please select a role'
      isValid = false
    } else {
      newErrors.role = ''
    }
    
    // Check company
    const companyValue = (document.getElementsByName('company')[0] as HTMLInputElement).value
    if (!companyValue.trim()) {
      newErrors.company = 'Company name is required'
      isValid = false
    } else if (companyValue.length < 2) {
      newErrors.company = 'Company name must be at least 2 characters'
      isValid = false
    } else {
      newErrors.company = ''
    }
    
    // Check location if not remote
    if (!isRemote && !selectedCountry) {
      newErrors.country = 'Country is required for non-remote positions'
      isValid = false
    } else {
      newErrors.country = ''
    }
    
    // Check salary
    const salaryMin = parseFloat((document.getElementsByName('salaryMin')[0] as HTMLInputElement).value)
    const salaryMax = parseFloat((document.getElementsByName('salaryMax')[0] as HTMLInputElement).value)
    
    if (isNaN(salaryMin) || isNaN(salaryMax)) {
      newErrors.salaryMin = 'Salary range is required'
      newErrors.salaryMax = 'Salary range is required'
      isValid = false
    } else if (salaryMin > salaryMax) {
      newErrors.salaryMin = 'Minimum salary cannot be greater than maximum'
      newErrors.salaryMax = 'Minimum salary cannot be greater than maximum'
      isValid = false
    } else {
      newErrors.salaryMin = ''
      newErrors.salaryMax = ''
    }
    
    // Check description
    const descriptionValue = (document.getElementsByName('description')[0] as HTMLTextAreaElement).value
    if (!descriptionValue.trim()) {
      newErrors.description = 'Job description is required'
      isValid = false
    } else if (descriptionValue.length < 100) {
      newErrors.description = 'Description must be at least 100 characters'
      isValid = false
    } else {
      newErrors.description = ''
    }
    
    setErrors(newErrors)
    return isValid
  }

  // Save form data periodically
  const saveFormState = () => {
    try {
      const formData: JobFormData = {
        role: (document.getElementsByName('role')[0] as HTMLSelectElement)?.value,
        company: (document.getElementsByName('company')[0] as HTMLInputElement)?.value,
        website: (document.getElementsByName('website')[0] as HTMLInputElement)?.value,
        social: (document.getElementsByName('social')[0] as HTMLInputElement)?.value,
        jobType,
        isRemote,
        selectedCountry,
        selectedState,
        selectedCity,
        type: (document.getElementsByName('type')[0] as HTMLSelectElement)?.value,
        currency,
        salaryMin: (document.getElementsByName('salaryMin')[0] as HTMLInputElement)?.value,
        salaryMax: (document.getElementsByName('salaryMax')[0] as HTMLInputElement)?.value,
        description: (document.getElementsByName('description')[0] as HTMLTextAreaElement)?.value,
      }
      
      // Add video URLs
      for (let i = 1; i <= 5; i++) {
        formData[`video${i}`] = (document.getElementsByName(`video${i}`)[0] as HTMLInputElement)?.value
      }
      
      saveFormData(STORAGE_KEYS.JOB_POST, formData)
      addToast('Form data auto-saved', 'info')
    } catch (error) {
      console.error('Error saving form state:', error)
      addToast('Failed to save form data', 'error')
    }
  }

  // Set up auto-save
  useEffect(() => {
    // Save form data every 10 seconds
    const intervalId = setInterval(saveFormState, 10000)
    
    // Save on page unload
    const handleBeforeUnload = () => {
      saveFormState()
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      clearInterval(intervalId)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [jobType, isRemote, currency, selectedCountry, selectedState, selectedCity])

  // Function to actually submit the job post
  const submitJobPost = async (formData: JobFormData) => {
    setIsSubmitting(true)
    
    try {
      // Get CSRF token
      const csrfResponse = await fetch('/api/csrf')
      const { csrfToken } = await csrfResponse.json()
      
      // Format job data for API
      const jobPost = {
        role: formData.role || '',
        company: formData.company || '',
        website: formData.website || undefined,
        social: formData.social || undefined,
        isRemote: formData.isRemote,
        location: !formData.isRemote ? {
          country: formData.selectedCountry,
          state: formData.selectedState || undefined,
          city: formData.selectedCity || undefined
        } : undefined,
        jobType: formData.type || formData.jobType,
        salary: {
          min: parseFloat(formData.salaryMin),
          max: parseFloat(formData.salaryMax),
          currency: formData.currency
        },
        description: formData.description,
        videos: [1, 2, 3, 4, 5]
          .map(i => formData[`video${i}`])
          .filter(url => url),
      }
      
      // Submit job post to API
      const response = await fetch('/api/jobs/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(jobPost)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to post job')
      }
      
      const result = await response.json()

      // Clear the saved form data
      clearFormData(STORAGE_KEYS.JOB_POST)

      // Navigate to the job post view (using the returned job ID in a real app)
      router.push(`/jobs/${result.jobId || '1'}`)
    } catch (error) {
      console.error('Error posting job:', error)
      setFormError(error instanceof Error ? error.message : 'An error occurred while posting the job. Please try again.')
      setIsSubmitting(false)
      // Scroll to top of form to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    // Save current form state
    saveFormState()

    // Validate form
    if (!validateForm()) {
      setFormError('Please fix the errors in the form before submitting.')
      // Scroll to top of form to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Check if user is authenticated
    if (status !== 'authenticated') {
      // Set flag to redirect to auth page
      setRedirectToAuth(true)
      return
    }
    
    // Get form data from the DOM
    const formData: JobFormData = {
      role: (document.getElementsByName('role')[0] as HTMLSelectElement).value,
      company: (document.getElementsByName('company')[0] as HTMLInputElement).value,
      website: (document.getElementsByName('website')[0] as HTMLInputElement).value,
      social: (document.getElementsByName('social')[0] as HTMLInputElement).value,
      isRemote,
      selectedCountry,
      selectedState,
      selectedCity,
      type: (document.getElementsByName('type')[0] as HTMLSelectElement).value,
      jobType,
      currency,
      salaryMin: (document.getElementsByName('salaryMin')[0] as HTMLInputElement).value,
      salaryMax: (document.getElementsByName('salaryMax')[0] as HTMLInputElement).value,
      description: (document.getElementsByName('description')[0] as HTMLTextAreaElement).value,
    }
    
    // Add video URLs
    for (let i = 1; i <= 5; i++) {
      formData[`video${i}`] = (document.getElementsByName(`video${i}`)[0] as HTMLInputElement).value
    }
    
    // Submit the job post
    await submitJobPost(formData)
  }

  // Update the submit button text based on authentication status
  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Submitting...'
    if (status !== 'authenticated') return 'Continue to Sign In'
    return 'Post Job'
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="relative isolate">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(0, 0, 255, 0.15), transparent 50%)',
          }}
        />
        
        {/* Content */}
        <div className="mx-auto max-w-3xl px-6 py-12 pt-32">
          <h1 className="text-3xl font-bold text-white mb-4">Post a Job</h1>
          <p className="text-gray-400 mb-8">
            Fill out the form below to post your job listing. Be as detailed as possible to attract the
            right candidates.
          </p>

          {formError && (
            <div className="bg-red-900/50 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Error</p>
              <p className="text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.role ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role} className="py-2">
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-white mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Your company name"
                required
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.company ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-500">{errors.company}</p>
              )}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-white mb-1">
                Company Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="https://example.com"
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.website ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-500">{errors.website}</p>
              )}
            </div>

            <div>
              <label htmlFor="social" className="block text-sm font-medium text-white mb-1">
                Social Media URL
              </label>
              <input
                type="url"
                id="social"
                name="social"
                placeholder="https://instagram.com/company or https://youtube.com/@channel"
                onChange={(e) => handleInputChange('social', e.target.value)}
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.social ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.social && (
                <p className="mt-1 text-sm text-red-500">{errors.social}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Is this a remote position?
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="remote-yes"
                    name="remote"
                    type="radio"
                    checked={isRemote}
                    onChange={() => setIsRemote(true)}
                    className="h-4 w-4 border-white/10 bg-[#111] text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="remote-yes" className="ml-2 block text-sm font-medium text-white">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="remote-no"
                    name="remote"
                    type="radio"
                    checked={!isRemote}
                    onChange={() => setIsRemote(false)}
                    className="h-4 w-4 border-white/10 bg-[#111] text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="remote-no" className="ml-2 block text-sm font-medium text-white">
                    No
                  </label>
                </div>
              </div>
            </div>

            {!isRemote && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-white mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    required={!isRemote}
                    className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.country ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country} className="py-2">
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                  )}
                </div>

                {selectedCountry && states[selectedCountry] && (
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-white mb-1">
                      State/Province
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
                    >
                      <option value="">Select a state</option>
                      {states[selectedCountry].map((state) => (
                        <option key={state} value={state} className="py-2">
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedState && cities[selectedState] && (
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-white mb-1">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
                    >
                      <option value="">Select a city</option>
                      {cities[selectedState].map((city) => (
                        <option key={city} value={city} className="py-2">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-white mb-1">
                Job Type
              </label>
              <select
                id="jobType"
                name="type"
                className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Monthly Salary Range <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Enter the monthly salary range in your selected currency
              </p>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label htmlFor="salaryMin" className="sr-only">
                    Minimum
                  </label>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    placeholder="Min per month"
                    required
                    onChange={(e) => handleSalaryChange(e.target.value, (document.getElementsByName('salaryMax')[0] as HTMLInputElement).value)}
                    className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.salaryMin ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                  />
                  {errors.salaryMin && (
                    <p className="mt-1 text-sm text-red-500">{errors.salaryMin}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="salaryMax" className="sr-only">
                    Maximum
                  </label>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    placeholder="Max per month"
                    required
                    onChange={(e) => handleSalaryChange((document.getElementsByName('salaryMin')[0] as HTMLInputElement).value, e.target.value)}
                    className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.salaryMax ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                  />
                  {errors.salaryMax && (
                    <p className="mt-1 text-sm text-red-500">{errors.salaryMax}</p>
                  )}
                </div>
              </div>
              <select
                id="currency"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code} className="py-2">
                    {curr.code} ({curr.symbol}) - {curr.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                placeholder="Describe the role, responsibilities, and any other relevant details..."
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.description ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Reference Videos (Optional)
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Add up to 5 YouTube or Instagram video URLs as references
              </p>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index}>
                    <input
                      type="url"
                      id={`video-${index}`}
                      name={`video${index}`}
                      placeholder={`Video URL #${index}`}
                      onChange={(e) => handleVideoChange(index - 1, e.target.value)}
                      className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.videos[index - 1] ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                    />
                    {errors.videos[index - 1] && (
                      <p className="mt-1 text-sm text-red-500">{errors.videos[index - 1]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/jobs"
                className="rounded-full bg-[#222] px-6 py-3 text-sm font-medium text-white hover:bg-[#333] transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`rounded-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100'} px-6 py-3 text-sm font-medium text-black transition-all duration-200 flex items-center space-x-2`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <span>{getSubmitButtonText()}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
} 