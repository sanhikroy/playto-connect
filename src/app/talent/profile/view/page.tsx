'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BriefcaseIcon,
  ArrowLeftIcon,
  PlayIcon,
  XMarkIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import { processVideoUrl, formatExperienceLevel, getDefaultProfilePicture } from '@/lib/utils/talentProfile'

// Add modal backdrop styling
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="relative max-w-6xl max-h-[90vh] w-full">
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        {children}
      </div>
    </div>
  );
};

// Update interface and video helper functions
interface TalentProfile {
  id: string
  userId: string
  name?: string
  title: string
  bio: string
  skills: string[]
  experience: string
  socialMediaUrl: string | null
  email?: string
  isComplete: boolean
  createdAt: string
  updatedAt: string
  profilePicture?: string
  portfolioVideos: Array<{
    id: string
    url: string
    type: string
    title?: string
  }>
}

// Function to get video thumbnail
const getVideoThumbnail = (videoInfo: { type: string, id: string } | null): string => {
  if (!videoInfo) return '';
  
  if (videoInfo.type === 'youtube') {
    return `https://img.youtube.com/vi/${videoInfo.id}/0.jpg`;
  } else if (videoInfo.type === 'instagram') {
    // Instagram doesn't have easy thumbnail access, use a placeholder
    return '/instagram-placeholder.jpg';
  }
  
  return '';
};

export default function ViewTalentProfile() {
  const [profile, setProfile] = useState<TalentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<{ type: string, id: string, url: string } | null>(null)
  const [profileImageError, setProfileImageError] = useState(false)
  
  const openVideoModal = (video: { type: string, id: string, url: string } | null) => {
    if (video) {
      setCurrentVideo(video);
      setModalOpen(true);
    }
  };
  
  const closeVideoModal = () => {
    setModalOpen(false);
    // Reset current video after animation completes
    setTimeout(() => setCurrentVideo(null), 300);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/talent/profile');
        
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="animate-pulse">
            <div className="h-32 w-32 bg-white/10 rounded-full mx-auto mb-4"></div>
            <div className="h-8 w-48 bg-white/10 rounded mx-auto mb-2"></div>
            <div className="h-4 w-64 bg-white/10 rounded mx-auto mb-8"></div>
            <div className="h-40 bg-white/10 rounded-xl mb-6"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-white/10 rounded-xl"></div>
              <div className="h-20 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-gray-400 mb-8">
              The talent profile you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/talent/dashboard"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-100 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/talent/dashboard"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Header with Contact Buttons */}
        <div className="flex flex-col md:flex-row md:items-start mb-12">
          <div className="flex items-center mb-6 md:mb-0 md:flex-1">
            <div className="relative h-24 w-24 rounded-full bg-white/10 overflow-hidden mr-6 flex items-center justify-center">
              {profile?.profilePicture && !profileImageError ? (
                <img 
                  src={profile.profilePicture} 
                  alt={profile.name || 'Profile'} 
                  className="h-full w-full object-cover"
                  onError={() => setProfileImageError(true)}
                />
              ) : (
                <img 
                  src={getDefaultProfilePicture()} 
                  alt={profile?.name || 'Profile'} 
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
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white mb-1">{profile?.name || 'Talent'}</h1>
              <p className="text-xl text-gray-400">{profile?.title}</p>
            </div>
          </div>
        </div>

        {/* Contact Card and Stats in the same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Contact Card */}
          <div className="bg-[#111] rounded-xl p-6 text-center shadow-lg ring-1 ring-white/10">
            <div className="grid grid-cols-2 gap-4">
              {profile.socialMediaUrl && (
                <a 
                  href={profile.socialMediaUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Social
                </a>
              )}
              
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Email
                </a>
              )}
              
              <Link
                href="/talent/profile/edit"
                className="inline-flex items-center justify-center rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 col-span-2"
              >
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>
          
          {/* Experience Card */}
          <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10">
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-white mb-2">{formatExperienceLevel(profile.experience)}</p>
              <p className="text-gray-400">Professional Experience</p>
            </div>
          </div>
        </div>

        {/* About and Skills Sections in the same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10 h-full">
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
            <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10 h-full">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Videos Section - Thumbnails with play button */}
        {profile.portfolioVideos && profile.portfolioVideos.length > 0 && (
          <div className="mt-20 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.portfolioVideos.map((video) => {
                const videoInfo = processVideoUrl(video.url);
                if (!videoInfo) return null;
                
                return (
                  <div key={video.id} className="bg-[#111] rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">
                    <div className="relative aspect-video">
                      <img 
                        src={getVideoThumbnail(videoInfo)}
                        alt={video.title || `${video.type} video`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if thumbnail fails to load
                          e.currentTarget.src = video.type === 'youtube' 
                            ? 'https://placehold.co/600x400/222/666?text=YouTube' 
                            : 'https://placehold.co/600x400/222/666?text=Instagram';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={() => openVideoModal(videoInfo ? { ...videoInfo, url: video.url } : null)}
                          className="w-16 h-16 rounded-full bg-blue-500/80 flex items-center justify-center hover:bg-blue-500 transition-colors"
                          aria-label="Play video"
                        >
                          <PlayIcon className="h-8 w-8 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-400 text-sm">
                        {video.title || (video.type === 'youtube' ? 'YouTube Video' : 'Instagram Post')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Video Modal */}
        <Modal isOpen={modalOpen} onClose={closeVideoModal}>
          {currentVideo && currentVideo.type === 'youtube' ? (
            <div className="aspect-video w-full">
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : currentVideo && currentVideo.type === 'instagram' ? (
            <div className="max-w-lg mx-auto">
              <div className="aspect-square w-full">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.instagram.com/p/${currentVideo.id}/embed`}
                  title="Instagram post"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                ></iframe>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </main>
  )
} 