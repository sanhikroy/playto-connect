'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CompleteTalentProfile() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    skills: '',
    experience: '',
    portfolio: '',
    social: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/talent/profile', {
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

      // Redirect to the talent dashboard
      router.push('/talent/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
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
              Complete Your Profile
            </h1>
            <p className="mt-3 text-lg leading-8 text-gray-400">
              Tell us about yourself and your expertise to help employers find you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
            {error && (
              <div className="rounded-lg bg-red-500/10 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Professional Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-white">
                Professional Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="e.g., Video Editor & Motion Designer"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium leading-6 text-white">
                Bio <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="Tell us about yourself and your work..."
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium leading-6 text-white">
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="e.g., Adobe Premiere Pro, After Effects, DaVinci Resolve"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium leading-6 text-white">
                Experience <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="Describe your relevant work experience..."
                />
              </div>
            </div>

            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium leading-6 text-white">
                Portfolio URL
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>

            {/* Social Media URL */}
            <div>
              <label htmlFor="social" className="block text-sm font-medium leading-6 text-white">
                Social Media URL
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  id="social"
                  name="social"
                  value={formData.social}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="https://youtube.com/@yourchannel"
                />
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