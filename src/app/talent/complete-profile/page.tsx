'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pb } from '@/lib/pocketbase'

export default function CompleteTalentProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    skills: [] as string[],
    experience: '',
    portfolio_url: '',
    social_media_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'skills') {
      // Split skills by comma and trim whitespace
      setFormData(prev => ({ 
        ...prev, 
        [name]: value.split(',').map(skill => skill.trim()).filter(Boolean)
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get the current authenticated user
      const authData = pb.authStore.model;
      if (!authData) {
        throw new Error('Not authenticated');
      }

      // Check if profile already exists
      let record;
      try {
        record = await pb.collection('talent_profiles').getFirstListItem(
          `user = "${authData.id}"`
        );
      } catch {
        // Profile doesn't exist yet, continue with creation
      }

      const profileData = {
        user: authData.id,
        title: formData.title,
        bio: formData.bio,
        skills: formData.skills,
        experience: formData.experience,
        portfolio_url: formData.portfolio_url || null,
        social_media_url: formData.social_media_url || null,
        is_complete: true
      };

      if (record) {
        // Update existing profile
        await pb.collection('talent_profiles').update(record.id, profileData);
      } else {
        // Create new profile
        await pb.collection('talent_profiles').create(profileData);
      }

      // Redirect to the talent dashboard
      router.push('/talent/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving your profile')
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
                  value={formData.skills.join(', ')}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="e.g., Adobe Premiere Pro, After Effects, DaVinci Resolve"
                />
                <p className="mt-1 text-sm text-gray-400">Separate skills with commas</p>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium leading-6 text-white">
                Experience <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                >
                  <option value="">Select your experience level</option>
                  <option value="entry">Entry Level (0-1 years)</option>
                  <option value="1_to_3">Mid Level (1-3 years)</option>
                  <option value="3_to_5">Senior Level (3-5 years)</option>
                  <option value="5_plus">Expert Level (5+ years)</option>
                </select>
              </div>
            </div>

            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolio_url" className="block text-sm font-medium leading-6 text-white">
                Portfolio URL
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  id="portfolio_url"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm sm:leading-6"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>

            {/* Social Media URL */}
            <div>
              <label htmlFor="social_media_url" className="block text-sm font-medium leading-6 text-white">
                Social Media URL
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  id="social_media_url"
                  name="social_media_url"
                  value={formData.social_media_url}
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