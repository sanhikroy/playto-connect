'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface LocationData {
  states: {
    [country: string]: string[];
  };
  cities: {
    [state: string]: string[];
  };
}

interface JobFormData {
  role: string;
  company: string;
  website?: string;
  social?: string;
  isRemote: boolean;
  location: {
    country: string;
    state?: string;
    city?: string;
  } | undefined;
  jobType: string;
  salary: {
    min: string;
    max: string;
    currency: string;
  };
  description: string;
  videos: string[];
}

export default function EditJob() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
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
  const [formError, setFormError] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  
  const [formData, setFormData] = useState<JobFormData>({
    role: '',
    company: '',
    website: '',
    social: '',
    isRemote: true,
    location: undefined,
    jobType: 'Full-time',
    description: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    videos: ['', '', '', '', '']
  })

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

  // Location data
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
      'Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Florida', 'Georgia',
      'Illinois', 'Massachusetts', 'Michigan', 'New York', 'North Carolina',
      'Ohio', 'Pennsylvania', 'Texas', 'Virginia', 'Washington'
    ],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Germany': [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse', 'Lower Saxony', 'North Rhine-Westphalia',
      'Rhineland-Palatinate', 'Saxony', 'Thuringia'
    ],
    'India': [
      'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra',
      'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
    ],
    'Canada': ['Alberta', 'British Columbia', 'Ontario', 'Quebec'],
    'Australia': [
      'New South Wales', 'Queensland', 'South Australia', 'Victoria', 'Western Australia'
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

  // Currency options
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ].sort((a, b) => a.code.localeCompare(b.code))

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    setSelectedState('')
    setSelectedCity('')
  }, [selectedCountry])

  useEffect(() => {
    setSelectedCity('')
  }, [selectedState])

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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock job data
        const mockData: JobFormData = {
          role: 'Video Editor',
          company: 'Creative Studios',
          website: 'https://creativestudios.com',
          social: 'https://twitter.com/creativestudios',
          isRemote: true,
          location: undefined,
          jobType: 'Full-time',
          description: 'Looking for an experienced video editor to join our creative team. You will be responsible for editing YouTube videos, creating engaging content, and working with our content creators.',
          salary: {
            min: '4000',
            max: '7000',
            currency: 'USD'
          },
          videos: [
            'https://youtube.com/watch?v=example1',
            'https://youtube.com/watch?v=example2',
            '',
            '',
            ''
          ]
        }
        
        setFormData(mockData)
        
        // If there's location data and it's not remote
        if (!mockData.isRemote && mockData.location) {
          setSelectedCountry(mockData.location.country)
          if (mockData.location.state) setSelectedState(mockData.location.state)
          if (mockData.location.city) setSelectedCity(mockData.location.city)
        }
        
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchJob()
  }, [params.id])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }))
      
      if (salaryField === 'min' || salaryField === 'max') {
        const error = validateSalary(
          salaryField === 'min' ? value : formData.salary.min,
          salaryField === 'max' ? value : formData.salary.max
        )
        setErrors(prev => ({ 
          ...prev, 
          salaryMin: error, 
          salaryMax: error 
        }))
      }
    } else if (name === 'isRemote') {
      setFormData(prev => ({
        ...prev,
        isRemote: (e.target as HTMLInputElement).checked
      }))
    } else if (name.startsWith('video')) {
      const index = parseInt(name.replace('video', '')) - 1
      const updatedVideos = [...formData.videos]
      updatedVideos[index] = value
      
      setFormData(prev => ({
        ...prev,
        videos: updatedVideos
      }))
      
      // Validate URL
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      // Field-specific validation
      let error = ''
      
      switch (name) {
        case 'company':
          if (!value.trim()) error = 'Company name is required'
          else if (value.length < 2) error = 'Company name must be at least 2 characters'
          break
        case 'website':
        case 'social':
          if (value && !validateUrl(value)) error = 'Please enter a valid URL'
          break
        case 'description':
          if (!value.trim()) error = 'Job description is required'
          else if (value.length < 100) error = 'Description must be at least 100 characters'
          break
      }
      
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value)
    setFormData(prev => ({
      ...prev,
      location: {
        country: e.target.value,
        state: undefined,
        city: undefined
      }
    }))
  }
  
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value)
    setFormData(prev => ({
      ...prev,
      location: prev.location ? {
        ...prev.location,
        state: e.target.value,
        city: undefined
      } : {
        country: selectedCountry,
        state: e.target.value,
        city: undefined
      }
    }))
  }
  
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value)
    setFormData(prev => ({
      ...prev,
      location: prev.location ? {
        ...prev.location,
        city: e.target.value
      } : {
        country: selectedCountry,
        state: selectedState,
        city: e.target.value
      }
    }))
  }
  
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }
    
    // Check role
    if (!formData.role) {
      newErrors.role = 'Please select a role'
      isValid = false
    } else {
      newErrors.role = ''
    }
    
    // Check company
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
      isValid = false
    } else if (formData.company.length < 2) {
      newErrors.company = 'Company name must be at least 2 characters'
      isValid = false
    } else {
      newErrors.company = ''
    }
    
    // Check location if not remote
    if (!formData.isRemote && !selectedCountry) {
      newErrors.country = 'Country is required for non-remote positions'
      isValid = false
    } else {
      newErrors.country = ''
    }
    
    // Check salary
    const salaryMin = parseFloat(formData.salary.min)
    const salaryMax = parseFloat(formData.salary.max)
    
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
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required'
      isValid = false
    } else if (formData.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters'
      isValid = false
    } else {
      newErrors.description = ''
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    
    // Validate form
    if (!validateForm()) {
      setFormError('Please fix the errors in the form before submitting.')
      setSaving(false)
      // Scroll to top of form to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        // Navigate back to dashboard
        router.push('/employer/dashboard')
      }, 3000)
    } catch (error) {
      console.error('Error updating job:', error)
      setFormError('An error occurred while updating the job. Please try again.')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-white/10 rounded mb-8"></div>
            <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 w-24 bg-white/10 rounded"></div>
              <div className="h-10 bg-white/10 rounded"></div>
              <div className="h-4 w-24 bg-white/10 rounded"></div>
              <div className="h-10 bg-white/10 rounded"></div>
              <div className="h-4 w-24 bg-white/10 rounded"></div>
              <div className="h-32 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    )
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
        <div className="mx-auto max-w-3xl px-6 pt-32 pb-12">
          <div className="mb-8">
            <Link
              href="/employer/dashboard"
              className="inline-flex items-center text-blue-400 hover:text-blue-300"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Edit Job Listing</h1>
          <p className="text-gray-400 mb-8">
            Update your job listing with the latest information.
          </p>
          
          {formError && (
            <div className="bg-red-900/50 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Error</p>
              <p className="text-sm">{formError}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-500/10 text-green-400 p-4 rounded-lg">
              Job updated successfully! Redirecting to dashboard...
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
            
            {/* Company Name */}
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
            
            {/* Company Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-white mb-1">
                Company Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.website ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-500">{errors.website}</p>
              )}
            </div>
            
            {/* Social Media */}
            <div>
              <label htmlFor="social" className="block text-sm font-medium text-white mb-1">
                Social Media URL
              </label>
              <input
                type="url"
                id="social"
                name="social"
                value={formData.social || ''}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourcompany"
                className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.social ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
              />
              {errors.social && (
                <p className="mt-1 text-sm text-red-500">{errors.social}</p>
              )}
            </div>
            
            {/* Remote Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
              />
              <label htmlFor="isRemote" className="ml-2 block text-sm text-white">
                This is a remote position
              </label>
            </div>
            
            {/* Location Selectors (show only if not remote) */}
            {!formData.isRemote && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-white mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    required={!formData.isRemote}
                    className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.country ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
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
                      onChange={handleStateChange}
                      className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
                    >
                      <option value="">Select a state</option>
                      {states[selectedCountry].map((state) => (
                        <option key={state} value={state}>
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
                      onChange={handleCityChange}
                      className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
                    >
                      <option value="">Select a city</option>
                      {cities[selectedState].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            
            {/* Job Type */}
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-white mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                required
                className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            
            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Salary Range <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-1">
                  <select
                    name="salary.currency"
                    value={formData.salary.currency}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    name="salary.min"
                    value={formData.salary.min}
                    onChange={handleInputChange}
                    className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.salaryMin ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                    placeholder="Min"
                    required
                  />
                  {errors.salaryMin && (
                    <p className="mt-1 text-sm text-red-500">{errors.salaryMin}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    name="salary.max"
                    value={formData.salary.max}
                    onChange={handleInputChange}
                    className={`block w-full rounded-lg border-0 bg-[#111] px-4 py-3 text-white shadow-sm ring-1 ring-inset ${errors.salaryMax ? 'ring-red-500' : 'ring-white/10'} focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm`}
                    placeholder="Max"
                    required
                  />
                  {errors.salaryMax && (
                    <p className="mt-1 text-sm text-red-500">{errors.salaryMax}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Description */}
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
            </div>
            
            {/* Video URLs */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Video URLs (optional)
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
            
            <div className="pt-4 flex space-x-4">
              <button
                type="button"
                onClick={() => router.push('/employer/dashboard')}
                className="flex-1 rounded-full border border-white/10 bg-transparent px-4 py-3 text-base font-medium text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-white px-4 py-3 text-base font-medium text-black hover:bg-gray-100 disabled:bg-white/50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 