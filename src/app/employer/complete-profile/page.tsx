'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pb, EmployerProfileRecord } from '@/lib/pocketbase'
import { Country, State, City } from 'country-state-city'

export default function CompleteEmployerProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    industry: '',
    website: '',
    country: '',
    state: '',
    city: '',
    size: '',
  })

  useEffect(() => {
    const checkProfile = async () => {
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

        // If profile exists and is complete, redirect to dashboard
        if (profile.is_complete) {
          router.push('/employer/dashboard');
        }
      } catch (error) {
        // If no profile exists, continue with form
        if (error instanceof Error && error.message !== 'Not authenticated') {
          console.error('Error checking profile:', error);
        }
      }
    };

    checkProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const authData = pb.authStore.model;
      if (!authData) {
        throw new Error('Not authenticated');
      }

      // Get country and state names from codes
      const country = Country.getCountryByCode(formData.country);
      const state = State.getStateByCodeAndCountry(formData.state, formData.country);

      // Prepare data for profile creation
      const data = {
        user: authData.id,
        company_name: formData.companyName,
        company_description: formData.companyDescription,
        industry: formData.industry,
        website: formData.website,
        location: `${formData.city}, ${state?.isoCode || formData.state}, ${country?.isoCode || formData.country}`,
        size: formData.size,
        is_complete: true
      };

      // Create profile
      await pb.collection('employer_profiles').create(data);
      
      // Redirect to dashboard
      router.push('/employer/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to create profile');
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
      <div className="relative isolate">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(0, 0, 255, 0.15), transparent 50%)',
          }}
        />
        
        {/* Content */}
        <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Complete Company Profile
            </h1>
            <p className="mt-3 text-lg leading-8 text-gray-400">
              Tell us about your company to help talent understand your organization better.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
            {error && (
              <div className="rounded-lg bg-red-500/10 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-white">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="e.g., Acme Corporation"
                />
              </div>
            </div>

            {/* Company Description */}
            <div>
              <label htmlFor="companyDescription" className="block text-sm font-medium leading-6 text-white">
                Company Description <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows={4}
                  value={formData.companyDescription}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="Tell us about your company's mission, values, and culture..."
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium leading-6 text-white">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>Select industry</option>
                  <option value="Media Production">Media Production</option>
                  <option value="Creative Agency">Creative Agency</option>
                  <option value="Technology">Technology</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium leading-6 text-white">
                Company Website <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 relative">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6 appearance-none pr-8"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="" disabled>Select country</option>
                    {countryOptions.map(option => (
                      <option key={option.value} value={option.value}>
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
                <label htmlFor="state" className="block text-sm font-medium leading-6 text-white">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 relative">
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    disabled={!formData.country}
                    className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6 appearance-none pr-8 disabled:opacity-50"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="" disabled>Select state</option>
                    {formData.country && getStateOptions(formData.country).map(option => (
                      <option key={option.value} value={option.value}>
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
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 relative">
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={!formData.state}
                    className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6 appearance-none pr-8 disabled:opacity-50"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="" disabled>Select city</option>
                    {formData.country && formData.state && getCityOptions(formData.country, formData.state).map(option => (
                      <option key={option.value} value={option.value}>
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

            {/* Company Size */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium leading-6 text-white">
                Company Size <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>Select company size</option>
                  <option value="1-9">1-9</option>
                  <option value="10-50">10-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501+">501+</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white px-8 py-3 text-base font-medium text-black hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 