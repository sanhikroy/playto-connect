'use client'

import { useState, useEffect } from 'react'
import { Country, State, City } from 'country-state-city'
import { pb } from '@/lib/pocketbase'

// Types
export interface Role {
  id: string;
  name: string;
  slug: string;
  status: boolean;
}

export interface FormErrors {
  title: string;
  description: string;
  requirements: string;
  role: string;
  company?: string;
  website?: string;
  social?: string;
  country: string;
  state: string;
  city: string;
  salary: string;
  videos: string[];
  assignment?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  role: string;
  company?: string;
  website?: string;
  social?: string;
  isRemote: boolean;
  country: string;
  state: string;
  city: string;
  type: string;
  salaryCurrency: string;
  salaryMin: string;
  salaryMax: string;
  salaryFrequency: 'hourly' | 'monthly' | 'annual' | 'project';
  salary: string; // For compatibility with existing code - will store formatted salary
  videos: string[];
  assignment?: string; // URL to assignment details
  status: 'Active' | 'Draft' | 'Closed';
}

interface JobFormProps {
  initialData?: JobFormData;
  onSubmit: (formData: JobFormData) => Promise<void>;
  submitButtonLabel?: string;
  isEmployer?: boolean;
}

export default function JobForm({
  initialData,
  onSubmit,
  submitButtonLabel = 'Submit',
  isEmployer = true
}: JobFormProps) {
  const [loading, setLoading] = useState(false)
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
    videos: ['', '', '', '', ''],
    assignment: ''
  })
  
  const defaultFormData: JobFormData = {
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
    salaryCurrency: '',
    salaryMin: '',
    salaryMax: '',
    salaryFrequency: 'annual',
    salary: '',
    videos: ['', '', '', '', ''],
    assignment: '',
    status: 'Active'
  }
  
  const [formData, setFormData] = useState<JobFormData>(initialData || defaultFormData)
  const [roles, setRoles] = useState<Role[]>([])

  // Fetch roles from the database
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await pb.collection('role').getList(1, 100);
        const roleItems = response.items.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          status: item.status
        })) as Role[];
        
        setRoles(roleItems);
      } catch (err) {
        console.error('Error fetching roles:', err)
      }
    }

    fetchRoles()
  }, [])

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
      videos: ['', '', '', '', ''],
      assignment: ''
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
    
    // Check company name for non-employer users
    if (!isEmployer && !formData.company?.trim()) {
      newErrors.company = 'Company name is required'
      isValid = false
    }
    
    // Check location if not remote
    if (!formData.isRemote) {
      if (!formData.country) {
        newErrors.country = 'Country is required for non-remote positions'
        isValid = false
      }
      if (formData.country && !formData.state) {
        newErrors.state = 'State is required for non-remote positions'
        isValid = false
      }
      if (formData.state && !formData.city) {
        newErrors.city = 'City is required for non-remote positions'
        isValid = false
      }
    }
    
    // Check salary fields
    if (!formData.salaryCurrency) {
      newErrors.salary = 'Currency is required'
      isValid = false
    } else if (!formData.salaryMin) {
      newErrors.salary = 'Minimum salary is required'
      isValid = false
    } else if (isNaN(Number(formData.salaryMin)) || Number(formData.salaryMin) < 0) {
      newErrors.salary = 'Minimum salary must be a positive number'
      isValid = false
    } else if (formData.salaryMax && (isNaN(Number(formData.salaryMax)) || Number(formData.salaryMax) < 0)) {
      newErrors.salary = 'Maximum salary must be a positive number'
      isValid = false
    } else if (formData.salaryMax && Number(formData.salaryMin) > Number(formData.salaryMax)) {
      newErrors.salary = 'Minimum salary cannot be greater than maximum salary'
      isValid = false
    }
    
    // Check website
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL'
      isValid = false
    }
    
    // Check social media
    if (formData.social && !validateUrl(formData.social)) {
      newErrors.social = 'Please enter a valid URL'
      isValid = false
    }
    
    // Check assignment URL
    if (formData.assignment && !validateUrl(formData.assignment)) {
      newErrors.assignment = 'Please enter a valid URL'
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
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user starts typing
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleVideoChange = (index: number, value: string) => {
    const updatedVideos = [...formData.videos]
    updatedVideos[index] = value
    
    setFormData(prev => ({
      ...prev,
      videos: updatedVideos
    }))
    
    // Clear error for this video field
    const updatedErrors = [...errors.videos]
    updatedErrors[index] = ''
    setErrors(prev => ({
      ...prev,
      videos: updatedErrors
    }))
  }

  const handleLocationChange = (type: 'country' | 'state' | 'city', value: string) => {
    setFormData(prev => ({ ...prev, [type]: value }))
    
    // Reset child selections
    if (type === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '' }))
    } else if (type === 'state') {
      setFormData(prev => ({ ...prev, city: '' }))
    }
    
    // Clear error
    setErrors(prev => ({ ...prev, [type]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    // Format the salary field for storage
    const formattedData = { ...formData };
    
    // Format the salary string based on the available values
    const currency = formData.salaryCurrency;
    const min = formData.salaryMin;
    const max = formData.salaryMax;
    const frequency = formData.salaryFrequency;
    
    console.log("Salary data:", { currency, min, max, frequency });
    
    let formattedSalary = '';
    
    if (min && max && min !== max) {
      formattedSalary = `${currency}${min}-${currency}${max}`;
    } else {
      formattedSalary = `${currency}${min}`;
    }
    
    // Add frequency
    switch (frequency) {
      case 'hourly':
        formattedSalary += '/hour';
        break;
      case 'monthly':
        formattedSalary += '/month';
        break;
      case 'annual':
        formattedSalary += '/year';
        break;
      case 'project':
        formattedSalary += ' per project';
        break;
    }
    
    formattedData.salary = formattedSalary;
    
    setLoading(true)
    
    try {
      await onSubmit(formattedData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get all countries
  const countries = Country.getAllCountries()
  const countryOptions = countries.map(country => ({
    value: country.isoCode,
    label: country.name
  }))

  // Get states for selected country
  const getStateOptions = (countryCode: string) => {
    const states = State.getStatesOfCountry(countryCode)
    return states.map(state => ({
      value: state.isoCode,
      label: state.name
    }))
  }

  // Get cities for selected state
  const getCityOptions = (countryCode: string, stateCode: string) => {
    const cities = City.getCitiesOfState(countryCode, stateCode)
    return cities.map(city => ({
      value: city.name,
      label: city.name
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section: Basic Job Information */}
      <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10 hover:ring-blue-500/20 transition-all duration-300">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-medium mr-3">1</span>
          Basic Job Information
        </h2>
        
        <div className="space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Senior Video Editor"
              className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
              aria-required="true"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500" role="alert">{errors.title}</p>}
          </div>

          {/* Two-column layout for related fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1.5">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                aria-required="true"
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500" role="alert">{errors.role}</p>}
            </div>

            {/* Job Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1.5">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                aria-required="true"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Company Information (for non-employer users) */}
          {!isEmployer && (
            <div className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/[0.07] transition-colors duration-300">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                    aria-required="true"
                  />
                  {errors.company && <p className="mt-1 text-sm text-red-500" role="alert">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Company Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                    />
                    {errors.website && <p className="mt-1 text-sm text-red-500" role="alert">{errors.website}</p>}
                  </div>

                  <div>
                    <label htmlFor="social" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Social Media
                    </label>
                    <input
                      type="url"
                      id="social"
                      name="social"
                      value={formData.social || ''}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/yourcompany"
                      className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                    />
                    {errors.social && <p className="mt-1 text-sm text-red-500" role="alert">{errors.social}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section: Compensation & Location */}
      <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10 hover:ring-blue-500/20 transition-all duration-300">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-medium mr-3">2</span>
          Compensation & Location
        </h2>
        
        <div className="space-y-6">
          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="block text-sm font-medium text-gray-300 mb-1.5">
              Salary Information <span className="text-red-500">*</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Currency */}
              <div>
                <label htmlFor="salaryCurrency" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Currency
                </label>
                <select
                  id="salaryCurrency"
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                  aria-required="true"
                >
                  <option value="">Select currency</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="C$">CAD (C$)</option>
                  <option value="A$">AUD (A$)</option>
                </select>
              </div>
              
              {/* Frequency */}
              <div>
                <label htmlFor="salaryFrequency" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Payment Frequency
                </label>
                <select
                  id="salaryFrequency"
                  name="salaryFrequency"
                  value={formData.salaryFrequency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                  aria-required="true"
                >
                  <option value="hourly">Per hour</option>
                  <option value="monthly">Per month</option>
                  <option value="annual">Per year</option>
                  <option value="project">Per project</option>
                </select>
              </div>
            </div>
            
            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Min"
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Maximum <span className="text-xs text-gray-400">(optional)</span>
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Max"
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                />
              </div>
            </div>
            
            {errors.salary && <p className="mt-1 text-sm text-red-500" role="alert">{errors.salary}</p>}
            
            {/* Preview */}
            {formData.salaryCurrency && formData.salaryMin && (
              <div className="mt-2 p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg transform transition-all duration-300 hover:scale-[1.01] hover:border-blue-500/30">
                <p className="text-sm text-blue-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Salary Preview:</span> 
                  <span className="ml-1 font-semibold">{
                    (() => {
                      const currency = formData.salaryCurrency;
                      const min = formData.salaryMin;
                      const max = formData.salaryMax;
                      const frequency = formData.salaryFrequency;
                      
                      let preview = '';
                      
                      if (min && max && min !== max) {
                        preview = `${currency}${min}-${currency}${max}`;
                      } else {
                        preview = `${currency}${min}`;
                      }
                      
                      // Add frequency
                      switch (frequency) {
                        case 'hourly':
                          preview += '/hour';
                          break;
                        case 'monthly':
                          preview += '/month';
                          break;
                        case 'annual':
                          preview += '/year';
                          break;
                        case 'project':
                          preview += ' per project';
                          break;
                      }
                      
                      // Add commas for thousands
                      return preview.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    })()
                  }</span>
                </p>
              </div>
            )}
          </div>

          {/* Remote/Location Option */}
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/[0.07] transition-colors duration-300">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleInputChange}
                className="h-4 w-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-600"
                aria-labelledby="remote-label"
              />
              <label id="remote-label" htmlFor="isRemote" className="ml-2 block text-sm font-medium text-gray-300">
                This is a remote position
              </label>
            </div>

            {/* Location (conditional based on remote status) */}
            {!formData.isRemote && (
              <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5 animate-fadeIn">
                <p className="text-sm font-medium text-gray-300">Location Information <span className="text-red-500">*</span></p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={(e) => handleLocationChange('country', e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                      aria-required="true"
                    >
                      <option value="">Select a country</option>
                      {countryOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-1 text-sm text-red-500" role="alert">{errors.country}</p>}
                  </div>
                  
                  {/* State/Province */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1.5">
                      State/Province
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={(e) => handleLocationChange('state', e.target.value)}
                      disabled={!formData.country}
                      className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm disabled:opacity-50 transition-all duration-200 hover:ring-white/20"
                      aria-required="true"
                    >
                      <option value="">Select a state</option>
                      {formData.country && getStateOptions(formData.country).map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.state && <p className="mt-1 text-sm text-red-500" role="alert">{errors.state}</p>}
                  </div>
                  
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1.5">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      disabled={!formData.state}
                      className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm disabled:opacity-50 transition-all duration-200 hover:ring-white/20"
                      aria-required="true"
                    >
                      <option value="">Select a city</option>
                      {formData.country && formData.state && getCityOptions(formData.country, formData.state).map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.city && <p className="mt-1 text-sm text-red-500" role="alert">{errors.city}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section: Job Details */}
      <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10 hover:ring-blue-500/20 transition-all duration-300">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-medium mr-3">3</span>
          Job Details
        </h2>
        
        <div className="space-y-6">
          {/* Job Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              placeholder="Describe the job in detail..."
              className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
              aria-required="true"
            />
            {errors.description && <p className="mt-1 text-sm text-red-500" role="alert">{errors.description}</p>}
            <div className="mt-1 flex justify-between items-center">
              <p className="text-xs text-gray-400">
                {formData.description.length} characters
              </p>
              <p className={`text-xs ${formData.description.length >= 100 ? 'text-green-400' : 'text-yellow-400'} flex items-center`}>
                {formData.description.length >= 100 ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Minimum length met
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Minimum 100 characters required
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-300 mb-1.5">
              Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={5}
              placeholder="List the skills, experience, and qualifications needed for this role..."
              className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
              aria-required="true"
            />
            {errors.requirements && <p className="mt-1 text-sm text-red-500" role="alert">{errors.requirements}</p>}
          </div>

          {/* Assignment URL */}
          <div>
            <div className="flex items-center">
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-300 mb-1.5">
                Assignment Link
              </label>
              <div className="ml-2 bg-yellow-500/20 text-yellow-400 text-xs px-2.5 py-0.5 rounded-full">
                Optional
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              URL to assignment or test that candidates need to complete during the application process
            </p>
            <input
              type="url"
              id="assignment"
              name="assignment"
              value={formData.assignment}
              onChange={handleInputChange}
              placeholder="https://example.com/assignment"
              className="mt-1 block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
            />
            {errors.assignment && <p className="mt-1 text-sm text-red-500" role="alert">{errors.assignment}</p>}
          </div>

          {/* Portfolio/Sample work links */}
          <div className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/[0.07] transition-colors duration-300">
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Portfolio/Sample Work Links
              </label>
              <div className="ml-2 bg-yellow-500/20 text-yellow-400 text-xs px-2.5 py-0.5 rounded-full">
                Optional
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Specify URLs for the types of work you want candidates to submit
            </p>
            
            <div className="space-y-3">
              {formData.videos.map((url, index) => (
                <div key={index}>
                  <div className="flex">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleVideoChange(index, e.target.value)}
                      placeholder={`Portfolio link ${index + 1}`}
                      className="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:ring-white/20"
                    />
                  </div>
                  {errors.videos[index] && (
                    <p className="mt-1 text-sm text-red-500" role="alert">{errors.videos[index]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Summary & Submit */}
      <div className="bg-gradient-to-r from-[#111] to-[#161616] rounded-xl p-6 shadow-lg ring-1 ring-white/10 hover:ring-blue-500/20 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Ready to Post?</h2>
            <p className="text-sm text-gray-400">
              Before submitting, please double-check all required fields are completed.
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 mt-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Job Status Selection */}
            <div className="w-full md:w-auto space-y-2">
              <div className="flex items-center">
                <label htmlFor="status" className="text-sm font-medium text-gray-300">
                  Job Status
                </label>
                <div className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full">
                  Controls Visibility
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full md:w-64 rounded-md border-0 bg-white/5 py-2.5 px-3.5 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm transition duration-200"
                  >
                    <option value="Active">Active (Visible to talents)</option>
                    <option value="Draft">Draft (Hidden from talents)</option>
                    <option value="Closed">Closed (Not accepting applications)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`text-xs px-2 py-1 rounded ${
                  formData.status === 'Active' ? 'bg-green-500/10 text-green-400' : 
                  formData.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400' : 
                  'bg-red-500/10 text-red-400'
                }`}>
                  {formData.status === 'Active' ? 'Job is live and visible to talents' : 
                   formData.status === 'Draft' ? 'Job is saved but not visible to talents' : 
                   'Job is closed and not accepting new applications'}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full md:w-auto group rounded-md bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-8 text-base font-semibold text-white shadow-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100 active:scale-[0.98]"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center group-hover:translate-x-0.5 transition-transform duration-150">
                  {submitButtonLabel}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
} 