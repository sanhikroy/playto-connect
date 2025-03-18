'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  PlusIcon, 
  XMarkIcon,
  PaperClipIcon, 
  TrashIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline'
import Select, { MultiValue, SingleValue } from 'react-select'
import { skillOptions, experienceLevelOptions, processVideoUrl, getDefaultProfilePicture } from '@/lib/utils/talentProfile'

interface TalentProfile {
  title: string
  bio: string
  skills: string[]
  experience: string
  portfolioVideos: string[]
  socialMediaUrl: string
  profilePicture: File | null
  profilePictureUrl: string
}

// Function to validate YouTube and Instagram URLs
const validateVideoUrl = (url: string) => {
  if (!url) return true; // Empty URLs are valid (will be filtered out)
  return processVideoUrl(url) !== null;
};

export default function EditTalentProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<TalentProfile>({
    title: '',
    bio: '',
    skills: [],
    experience: '',
    portfolioVideos: [''],
    socialMediaUrl: '',
    profilePicture: null,
    profilePictureUrl: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/talent/profile');
        
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await res.json();
        
        // Transform the data to match our form structure
        const profileData = {
          title: data.title || '',
          bio: data.bio || '',
          skills: Array.isArray(data.skills) ? data.skills : [],
          experience: data.experience || '',
          portfolioVideos: Array.isArray(data.portfolioVideos) ? data.portfolioVideos : [''],
          socialMediaUrl: data.socialMediaUrl || '',
          profilePicture: null,
          profilePictureUrl: data.profilePicture || ''
        };
        
        setFormData(profileData);
        setProfileImagePreview(profileData.profilePictureUrl);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const skills = newValue.map(item => item.value);
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleExperienceChange = (
    newValue: SingleValue<{ value: string; label: string }>
  ) => {
    if (newValue) {
      setFormData(prev => ({ ...prev, experience: newValue.value }));
    }
  };

  const handleVideoChange = (index: number, value: string) => {
    const updatedVideos = [...formData.portfolioVideos];
    updatedVideos[index] = value;
    setFormData(prev => ({ ...prev, portfolioVideos: updatedVideos }));
  };

  const addVideoField = () => {
    setFormData(prev => ({
      ...prev,
      portfolioVideos: [...prev.portfolioVideos, '']
    }));
  };

  const removeVideoField = (index: number) => {
    const updatedVideos = formData.portfolioVideos.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, portfolioVideos: updatedVideos.length ? updatedVideos : [''] }));
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setUploadError(null);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, GIF, and WebP are supported.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('File too large. Maximum size is 5MB.');
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Store the file for upload
    setFormData(prev => ({ ...prev, profilePicture: file }));
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!formData.profilePicture) {
      return formData.profilePictureUrl; // Return existing URL if no new file
    }

    setUploadingImage(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', formData.profilePicture);

      const response = await fetch('/api/upload/profile-picture', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload profile picture');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    
    // Validate required fields
    if (!formData.title || !formData.bio || formData.skills.length === 0 || !formData.experience) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }
    
    // Validate video URLs
    const validVideos = formData.portfolioVideos
      .filter(url => url.trim() !== '')
      .filter(url => validateVideoUrl(url));
    
    if (validVideos.length !== formData.portfolioVideos.filter(url => url.trim() !== '').length) {
      setError('Please correct the invalid video URLs');
      setSaving(false);
      return;
    }
    
    try {
      // Upload profile picture if changed
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadProfilePicture();
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          // Ask user if they want to continue without uploading the profile picture
          if (!window.confirm('Failed to upload profile picture. Do you want to continue updating your profile without the new picture?')) {
            setSaving(false);
            return;
          }
          // Continue with profile update even if picture upload fails
        }
      } else {
        // Use existing URL if no new file
        profilePictureUrl = formData.profilePictureUrl;
      }
      
      // Prepare data for API
      const profileData = {
        title: formData.title,
        bio: formData.bio,
        skills: formData.skills,
        experience: formData.experience,
        portfolioVideos: validVideos,
        socialMediaUrl: formData.socialMediaUrl,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl })
      };
      
      // Update profile
      const response = await fetch('/api/talent/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      setSuccess(true);
      
      // Redirect after successful update
      setTimeout(() => {
        router.push('/talent/profile/view');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
          <div className="animate-pulse">
            <div className="h-8 w-2/3 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-white/10 rounded mb-6"></div>
            <div className="h-24 bg-white/10 rounded mb-4"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        <div className="mb-8">
          <Link
            href="/talent/dashboard"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Your Profile</h1>
          <p className="mt-2 text-gray-400">
            Update your professional information to help employers find you
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
            <p className="text-green-200">Profile updated successfully!</p>
          </div>
        )}
        
        <div className="bg-[#111] rounded-xl p-6 mb-10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Profile Picture
                </label>
                <div className="flex items-center">
                  <div className="relative h-24 w-24 rounded-full bg-white/10 overflow-hidden mr-6 flex items-center justify-center">
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
                      </div>
                    )}
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Profile Preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img 
                        src={getDefaultProfilePicture()} 
                        alt="Default Profile" 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const icon = document.createElement('div');
                            icon.innerHTML = `<svg class="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>`;
                            parent.appendChild(icon);
                          }
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="profilePicture" className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg inline-block">
                      Upload New Picture
                    </label>
                    <input 
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px or larger, JPG or PNG</p>
                    {uploadError && (
                      <p className="text-xs text-red-400 mt-1">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                  placeholder="e.g. Senior Video Editor"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                  placeholder="Tell us about yourself and your experience..."
                />
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-400 mb-1">
                  Skills
                </label>
                <Select
                  id="skills"
                  isMulti
                  name="skills"
                  options={skillOptions}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  value={skillOptions.filter(option => formData.skills.includes(option.value))}
                  onChange={handleSkillsChange}
                  placeholder="Select your skills..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.3)'
                      }
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(59, 130, 246, 0.3)'
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        color: 'white'
                      }
                    }),
                    input: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af'
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'white'
                    })
                  }}
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-400 mb-1">
                  Experience Level
                </label>
                <Select
                  id="experience"
                  name="experience"
                  options={experienceLevelOptions}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  value={experienceLevelOptions.find(option => option.value === formData.experience)}
                  onChange={handleExperienceChange}
                  placeholder="Select your experience level..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.3)'
                      }
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    input: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af'
                    })
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Portfolio Videos
                </label>
                <div className="space-y-3">
                  {formData.portfolioVideos.map((video, index) => (
                    <div key={index} className="flex items-center gap-2">
                <input
                        type="text"
                        value={video}
                        onChange={(e) => handleVideoChange(index, e.target.value)}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                        placeholder="YouTube or Instagram video URL"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideoField(index)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVideoField}
                    className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                  >
                    <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
                    Add Another Video
                  </button>
                  <p className="text-xs text-gray-500">
                    Add YouTube or Instagram video URLs to showcase your work
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="socialMediaUrl" className="block text-sm font-medium text-gray-400 mb-1">
                  Social Media URL
                </label>
                <input
                  type="text"
                  id="socialMediaUrl"
                  name="socialMediaUrl"
                  value={formData.socialMediaUrl}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                  placeholder="e.g. https://youtube.com/@yourchannel"
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Link
                  href="/talent/dashboard"
                  className="inline-flex justify-center rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-white hover:bg-white/5"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-100 disabled:bg-white/50 disabled:cursor-not-allowed"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 