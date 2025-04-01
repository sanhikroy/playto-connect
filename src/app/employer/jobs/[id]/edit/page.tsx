'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { pb, JobRecord } from '@/lib/pocketbase'
import { Country, State, City } from 'country-state-city'

interface Role {
  id: string;
  name: string;
  slug: string;
  status: boolean;
}

interface FormErrors {
  title: string;
  description: string;
  requirements: string;
  role: string;
  country: string;
  salary: string;
  videos: string[];
}

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  role: string;
  isRemote: boolean;
  country: string;
  state: string;
  city: string;
  type: string;
  salary: string;
  videos: string[];
}

export default function EditJob({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({
    title: '',
    description: '',
    requirements: '',
    role: '',
    country: '',
    salary: '',
    videos: ['', '', '', '', '']
  })
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
    role: '',
    isRemote: false,
    country: '',
    state: '',
    city: '',
    type: 'Full-time',
    salary: '',
    videos: ['', '', '', '', '']
  })

  const [roles, setRoles] = useState<Role[]>([])

  // List of available roles (will be fetched from DB)
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
      country: '',
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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const authData = pb.authStore.model;
        if (!authData) {
          throw new Error('Not authenticated');
        }

        const job = await pb.collection('jobs').getOne<JobRecord>(resolvedParams.id, {
          expand: 'employer'
        });

        // Parse location
        let country = '', state = '', city = '';
        if (!job.is_remote && job.location) {
          const locationParts = job.location.split(', ').map(part => part.trim());
          if (locationParts.length >= 3) {
            city = locationParts[0] || '';
            state = locationParts[1] || '';
            country = locationParts[2] || '';
          } else if (locationParts.length === 2) {
            state = locationParts[0] || '';
            country = locationParts[1] || '';
          } else if (locationParts.length === 1) {
            country = locationParts[0] || '';
          }
        }

        // Update form data with job details
        setFormData({
          title: job.title || '',
          description: job.description || '',
          requirements: job.requirements || '',
          role: job.role || '', // This is the role ID, not the name
          isRemote: job.is_remote || false,
          country: country,
          state: state,
          city: city,
          type: job.type || 'Full-time',
          salary: job.salary || '',
          videos: job.videos || ['', '', '', '', '']
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        setFormError(error instanceof Error ? error.message : 'Failed to load job');
        setLoading(false);
      }
    };

    fetchJob();
  }, [resolvedParams.id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'isRemote') {
      setFormData(prev => ({
        ...prev,
        isRemote: (e.target as HTMLInputElement).checked
      }));
    } else if (name.startsWith('video')) {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    
    // Validate form
    if (!validateForm()) {
      setFormError('Please fix the errors in the form before submitting.');
      setSaving(false);
      // Scroll to top of form to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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

      // Prepare data for update
      const data = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        role: formData.role,
        location: location,
        is_remote: formData.isRemote,
        type: formData.type,
        salary: formData.salary,
        videos: formData.videos.filter(Boolean)
      };

      // Update job
      await pb.collection('jobs').update(resolvedParams.id, data);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/employer/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating job:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to update job');
    } finally {
      setSaving(false);
    }
  }
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="relative isolate">
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
        </div>
      </main>
    );
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
                  <option key={role.id} value={role.id} className="py-2">
                    {role.name}
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
            
            {/* Remote Option */}
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
            
            {/* Job Type */}
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
            
            {/* Salary */}
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
              <p className="mt-1 text-sm text-gray-400">
                Minimum 100 characters
              </p>
            </div>
            
            {/* Requirements */}
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
            
            {/* Video URLs */}
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
                href="/employer/dashboard"
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 