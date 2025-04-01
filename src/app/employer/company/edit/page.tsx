'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { pb, EmployerProfileRecord } from '@/lib/pocketbase'
import { Country, State, City } from 'country-state-city'

interface ProfileData {
  company_name: string;
  industry: string;
  location: string;
  website: string;
  company_description: string;
  size: string;
  is_complete: boolean;
  logo?: string;
}

export default function EmployerProfileEdit() {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    country: '',
    state: '',
    city: '',
    website: '',
    socialMediaUrl: '',
    description: '',
    employeeCount: '',
    logoFile: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authData = pb.authStore.model;
        if (!authData) {
          throw new Error('Not authenticated');
        }

        const profile = await pb.collection('employer_profiles').getFirstListItem<EmployerProfileRecord>(
          `user = "${authData.id}"`,
          {
            expand: 'user'
          }
        );

        // Parse location string
        const [city, state, country] = profile.location?.split(', ').map(part => part.trim()) || ['', '', ''];

        // Update form data with existing profile
        setFormData(prev => ({
          ...prev,
          companyName: profile.company_name || '',
          industry: profile.industry || '',
          country: country || '',
          state: state || '',
          city: city || '',
          website: profile.website || '',
          description: profile.company_description || '',
          employeeCount: profile.size || ''
        }));

      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

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
    setError(null)
    
    try {
      const authData = pb.authStore.model;
      if (!authData) {
        throw new Error('Not authenticated');
      }

      // Get existing profile
      const existingProfile = await pb.collection('employer_profiles').getFirstListItem<EmployerProfileRecord>(
        `user = "${authData.id}"`,
        {
          expand: 'user'
        }
      );

      // Prepare data for update
      const data: ProfileData = {
        company_name: formData.companyName,
        industry: formData.industry,
        location: `${formData.city}, ${formData.state}, ${formData.country}`,
        website: formData.website,
        company_description: formData.description,
        size: formData.employeeCount,
        is_complete: true
      };

      // Handle logo upload if a new file is selected
      if (formData.logoFile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('logo', formData.logoFile);
        const fileRecord = await pb.collection('files').create(formDataWithFile);
        data.logo = fileRecord.id;
      }

      // Update profile
      await pb.collection('employer_profiles').update(existingProfile.id, data);
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
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
        
        {error && (
          <div className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-lg">
            {error}
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
                      <option value="" className="bg-black text-white">Select a country</option>
                      {countryOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-black text-white">
                          {option.label}
                        </option>
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
                      disabled={!formData.country}
                      className="block w-full rounded-lg border-0 bg-black/70 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm appearance-none pr-8 disabled:opacity-50"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                    >
                      <option value="" className="bg-black text-white">Select a state</option>
                      {formData.country && getStateOptions(formData.country).map(option => (
                        <option key={option.value} value={option.value} className="bg-black text-white">
                          {option.label}
                        </option>
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
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.state}
                      className="block w-full rounded-lg border-0 bg-black/70 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm appearance-none pr-8 disabled:opacity-50"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                    >
                      <option value="" className="bg-black text-white">Select a city</option>
                      {formData.country && formData.state && getCityOptions(formData.country, formData.state).map(option => (
                        <option key={option.value} value={option.value} className="bg-black text-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-4 w-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
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