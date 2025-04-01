'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { pb } from '@/lib/pocketbase'
import { Country, State, City } from 'country-state-city'
import { saveFormData, getFormData, clearFormData, STORAGE_KEYS } from '@/lib/utils/formStorage'
import { useToasts, ToastContainer } from '@/components/notifications/Toasts'

interface FormErrors {
  title: string;
  description: string;
  requirements: string;
  role: string;
  company: string;
  website: string;
  social: string;
  country: string;
  state: string;
  city: string;
  salary: string;
  videos: string[];
}

// Define a type for the form data
interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  role: string;
  company: string;
  website: string;
  social: string;
  isRemote: boolean;
  country: string;
  state: string;
  city: string;
  type: string;
  salary: string;
  videos: string[];
}

export default function PostJob() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({
    title: '',
    description: '',
    requirements: '',
    role: '',
    company: '',
    website: '',
    social: '',
    country: '',
    state: '',
    city: '',
    salary: '',
    videos: ['', '', '', '', '']
  })
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
    role: '',
    company: '',
    website: '',
    social: '',
    isRemote: true,
    country: '',
    state: '',
    city: '',
    type: 'Full-time',
    salary: '',
    videos: ['', '', '', '', '']
  })

  const { toasts, addToast, removeToast } = useToasts()

  // Load saved form data on initial render
  useEffect(() => {
    const savedFormData = getFormData(STORAGE_KEYS.JOB_POST)
    if (savedFormData) {
      setFormData(savedFormData);
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
          setFormData(savedForm);
          submitJobPost();
        }
      }
    }
  }, [])

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
  }, [formData])

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (formData.country) {
      setFormData(prev => ({ ...prev, state: '', city: '' }))
    }
  }, [formData.country])

  useEffect(() => {
    if (formData.state) {
      setFormData(prev => ({ ...prev, city: '' }))
    }
  }, [formData.state])

  // List of available roles
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

  // Job Types
  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
  ]

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

  const validateSalary = (salary: string) => {
    // Basic check for valid salary format (can be expanded based on requirements)
    if (!salary) return 'Salary is required'
    if (salary.trim() === '') return 'Salary is required'
    return ''
  }

  const validateForm = () => {
    let isValid = true
    const newErrors: FormErrors = {
      title: '',
      description: '',
      requirements: '',
      role: '',
      company: '',
      website: '',
      social: '',
      country: '',
      state: '',
      city: '',
      salary: '',
      videos: ['', '', '', '', '']
    }
    
    // Check title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
      isValid = false
    }
    
    // Check role
    if (!formData.role) {
      newErrors.role = 'Please select a role'
      isValid = false
    }
    
    // Check company
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
      isValid = false
    } else if (formData.company.length < 2) {
      newErrors.company = 'Company name must be at least 2 characters'
      isValid = false
    }
    
    // Check description
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required'
      isValid = false
    } else if (formData.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters'
      isValid = false
    }
    
    // Check requirements
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Job requirements are required'
      isValid = false
    }
    
    // Check location if not remote
    if (!formData.isRemote && !formData.country) {
      newErrors.country = 'Country is required for non-remote positions'
      isValid = false
    }
    
    // Check salary
    const salaryError = validateSalary(formData.salary)
    if (salaryError) {
      newErrors.salary = salaryError
      isValid = false
    }
    
    // Check URLs
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL'
      isValid = false
    }
    
    if (formData.social && !validateUrl(formData.social)) {
      newErrors.social = 'Please enter a valid URL'
      isValid = false
    }
    
    // Check video URLs
    const videoErrors = [...newErrors.videos]
    formData.videos.forEach((url, index) => {
      if (url && !validateUrl(url)) {
        videoErrors[index] = 'Please enter a valid URL'
        isValid = false
      } else {
        videoErrors[index] = ''
      }
    })
    newErrors.videos = videoErrors
    
    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('video')) {
      const index = parseInt(name.replace('video', '')) - 1;
      const updatedVideos = [...formData.videos];
      updatedVideos[index] = value;
      
      setFormData(prev => ({
        ...prev,
        videos: updatedVideos
      }));
      
      // Validate URL
      if (value && !validateUrl(value)) {
        const newErrors = { ...errors };
        newErrors.videos[index] = 'Please enter a valid URL';
        setErrors(newErrors);
      } else {
        const newErrors = { ...errors };
        newErrors.videos[index] = '';
        setErrors(newErrors);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Field-specific validation
      let error = '';
      
      switch (name) {
        case 'company':
          if (!value.trim()) error = 'Company name is required';
          else if (value.length < 2) error = 'Company name must be at least 2 characters';
          break;
        case 'website':
        case 'social':
          if (value && !validateUrl(value)) error = 'Please enter a valid URL';
          break;
        case 'description':
          if (!value.trim()) error = 'Job description is required';
          else if (value.length < 100) error = 'Description must be at least 100 characters';
          break;
        case 'requirements':
          if (!value.trim()) error = 'Job requirements are required';
          break;
        case 'title':
          if (!value.trim()) error = 'Title is required';
          break;
        case 'salary':
          error = validateSalary(value);
          break;
      }
      
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }

  const handleLocationChange = (type: 'country' | 'state' | 'city', value: string) => {
    if (type === 'country') {
      setFormData(prev => ({
        ...prev,
        country: value,
        state: '',
        city: ''
      }));
    } else if (type === 'state') {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        city: value
      }));
    }
  }

  // Save form state to localStorage
  const saveFormState = () => {
    try {
      saveFormData(STORAGE_KEYS.JOB_POST, formData);
      addToast('Form data auto-saved', 'info');
    } catch (error) {
      console.error('Error saving form state:', error);
      addToast('Failed to save form data', 'error');
    }
  }

  // Function to actually submit the job post
  const submitJobPost = async () => {
    setSaving(true)
    
    try {
      const authData = pb.authStore.model;
      if (!authData) {
        throw new Error('Not authenticated');
      }
      
      // Format location string
      let location = 'Remote';
      if (!formData.isRemote) {
        const locationParts = [formData.city, formData.state, formData.country].filter(Boolean);
        location = locationParts.join(', ');
      }

      // Prepare data for creation
      const data = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        role: formData.role,
        location: location,
        is_remote: formData.isRemote,
        type: formData.type,
        salary: formData.salary,
        employer: authData.id,
        status: 'Active',
        videos: formData.videos.filter(Boolean)
      };

      // Create the job
      const record = await pb.collection('jobs').create(data);
      
      // Clear the saved form data
      clearFormData(STORAGE_KEYS.JOB_POST)

      // Navigate to the job post view
      router.push(`/jobs/${record.id}`)
    } catch (error) {
      console.error('Error posting job:', error)
      setFormError(error instanceof Error ? error.message : 'An error occurred while posting the job. Please try again.')
      setSaving(false)
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
    if (!pb.authStore.isValid) {
      addToast('Please sign in to post a job', 'error')
      // Save form data for after authentication
      saveFormData(STORAGE_KEYS.JOB_POST, formData)
      // Redirect to sign in page
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/post-job?continue=true')}`)
      return
    }
    
    // Submit the job post
    await submitJobPost()
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
            {/* Role selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
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

            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter job title"
                required
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.title ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
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
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your company name"
                required
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
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
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
                value={formData.social}
                onChange={handleInputChange}
                placeholder="https://instagram.com/company or https://youtube.com/@channel"
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
                    checked={formData.isRemote}
                    onChange={() => setFormData(prev => ({...prev, isRemote: true}))}
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
                    checked={!formData.isRemote}
                    onChange={() => setFormData(prev => ({...prev, isRemote: false}))}
                    className="h-4 w-4 border-white/10 bg-[#111] text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="remote-no" className="ml-2 block text-sm font-medium text-white">
                    No
                  </label>
                </div>
              </div>
            </div>

            {!formData.isRemote && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-white mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={(e) => handleLocationChange('country', e.target.value)}
                    required={!formData.isRemote}
                    className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.country ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                  >
                    <option value="">Select a country</option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                  )}
                </div>
                
                {formData.country && (
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-white mb-1">
                      State/Province
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={(e) => handleLocationChange('state', e.target.value)}
                      className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
                    >
                      <option value="">Select a state</option>
                      {State.getStatesOfCountry(
                        Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || ''
                      ).map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {formData.state && (
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-white mb-1">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
                    >
                      <option value="">Select a city</option>
                      {City.getCitiesOfState(
                        Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || '',
                        State.getStatesOfCountry(
                          Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || ''
                        ).find(s => s.name === formData.state)?.isoCode || ''
                      ).map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-white mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-white mb-1">
                Salary <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g. $50,000 - $70,000/year or $30-40/hour"
                required
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.salary ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.salary && (
                <p className="mt-1 text-sm text-red-500">{errors.salary}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                required
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.description ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                placeholder="Describe the job responsibilities, requirements, and benefits..."
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-400">
                Minimum 100 characters
              </p>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-white mb-1">
                Job Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                required
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.requirements ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                placeholder="List the requirements for this position..."
              ></textarea>
              {errors.requirements && (
                <p className="mt-1 text-sm text-red-500">{errors.requirements}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Reference Videos (Optional)
              </label>
              <p className="text-sm text-gray-400 mb-3">
                Add links to videos that showcase your company or explain the job
              </p>
              
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <input
                      type="url"
                      name={`video${i}`}
                      value={formData.videos[i-1] || ''}
                      onChange={handleInputChange}
                      placeholder={`Video ${i} URL`}
                      className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.videos[i-1] ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                    />
                    {errors.videos[i-1] && (
                      <p className="mt-1 text-sm text-red-500">{errors.videos[i-1]}</p>
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
                disabled={saving}
                className={`rounded-full ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100'} px-6 py-3 text-sm font-medium text-black transition-all duration-200 flex items-center space-x-2`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <span>{pb.authStore.isValid ? 'Post Job' : 'Continue to Sign In'}</span>
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