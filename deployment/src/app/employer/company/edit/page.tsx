'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'

export default function EmployerProfileEdit() {
  const [formData, setFormData] = useState({
    companyName: 'Acme Productions',
    industry: 'Media Production',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    website: 'https://acmeproductions.com',
    socialMediaUrl: 'https://instagram.com/acmeproductions',
    description: 'Acme Productions is a leading media production company specializing in creating high-quality content for digital platforms.',
    employeeCount: '10-50',
    logoFile: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, logoFile: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setLoading(false)
    setSuccess(true)
    
    // Reset success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000)
  }

  // Common country options
  const countryOptions = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'France', 'India', 'Japan', 'China', 'Brazil', 'Other'
  ]

  // State options (US-focused for demo, would be dynamic based on country in a real app)
  const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
    'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-8">
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-8">Edit Company Profile</h1>
        
        {success && (
          <div className="mb-6 bg-green-500/10 text-green-400 p-4 rounded-lg">
            Profile updated successfully!
          </div>
        )}
        
        <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Logo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Company Logo
                </label>
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-white mr-4">
                    <BuildingOffice2Icon className="h-10 w-10" />
                  </div>
                  <input
                    type="file"
                    id="logoFile"
                    name="logoFile"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
                  />
                </div>
              </div>
              
              {/* Company name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-400 mb-1">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                />
              </div>
              
              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-400 mb-1">
                  Industry <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-lg border-0 bg-black/70 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm appearance-none pr-8"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="Media Production" className="bg-black text-white">Media Production</option>
                    <option value="Creative Agency" className="bg-black text-white">Creative Agency</option>
                    <option value="Technology" className="bg-black text-white">Technology</option>
                    <option value="Entertainment" className="bg-black text-white">Entertainment</option>
                    <option value="Marketing" className="bg-black text-white">Marketing</option>
                    <option value="Education" className="bg-black text-white">Education</option>
                    <option value="Other" className="bg-black text-white">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Location (Country, State, City) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-lg border-0 bg-black/70 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm appearance-none pr-8"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                    >
                      {countryOptions.map(country => (
                        <option key={country} value={country} className="bg-black text-white">{country}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-400 mb-1">
                    State <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-lg border-0 bg-black/70 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm appearance-none pr-8"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                    >
                      {stateOptions.map(state => (
                        <option key={state} value={state} className="bg-black text-white">{state}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-1">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-400 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                />
              </div>
              
              {/* Social Media URL */}
              <div>
                <label htmlFor="socialMediaUrl" className="block text-sm font-medium text-gray-400 mb-1">
                  Social Media URL
                </label>
                <input
                  type="url"
                  id="socialMediaUrl"
                  name="socialMediaUrl"
                  value={formData.socialMediaUrl}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                  placeholder="https://instagram.com/yourcompany"
                />
              </div>
              
              {/* Company description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                  Company Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                />
              </div>
              
              {/* Employee Count */}
              <div>
                <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-400 mb-1">
                  Employee Count
                </label>
                <div className="relative">
                  <select
                    id="employeeCount"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-0 bg-black/70 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm appearance-none pr-8"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="1-9" className="bg-black text-white">1-9</option>
                    <option value="10-50" className="bg-black text-white">10-50</option>
                    <option value="51-200" className="bg-black text-white">51-200</option>
                    <option value="201-500" className="bg-black text-white">201-500</option>
                    <option value="501+" className="bg-black text-white">501+</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-white px-4 py-3 text-base font-medium text-black hover:bg-gray-100 disabled:bg-white/50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 