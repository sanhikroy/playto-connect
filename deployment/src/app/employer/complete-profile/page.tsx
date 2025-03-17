'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CompleteEmployerProfile() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    industry: '',
    website: '',
    location: '',
    size: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/employer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Update the session to reflect the new profile data
      await update()

      // Redirect to the employer dashboard
      router.push('/employer/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ]

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
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="e.g., Technology, Media, Entertainment"
                />
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
            <div>
              <label htmlFor="location" className="block text-sm font-medium leading-6 text-white">
                Company Location <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="e.g., San Francisco, CA"
                />
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
                  {companySizes.map(size => (
                    <option key={size} value={size} className="bg-[#0F1116] text-white">
                      {size}
                    </option>
                  ))}
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