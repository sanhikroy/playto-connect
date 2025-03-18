'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  VideoCameraIcon, 
  PaintBrushIcon, 
  FilmIcon, 
  UsersIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MusicalNoteIcon,
  PuzzlePieceIcon,
  CameraIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  LinkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { saveJobApplication, getJobApplication, clearJobApplication } from '@/lib/utils/formStorage'
import { useToasts, ToastContainer } from '@/components/notifications/Toasts'

const jobsData = [
  {
    id: 1,
    role: 'Video Editor',
    company: 'Creative Studios Inc.',
    companyWebsite: 'https://creativestudios.com',
    socialMediaUrl: 'https://instagram.com/creativestudios',
    location: 'Remote',
    isRemote: true,
    jobType: 'Full-time',
    salaryMin: '4,000',
    salaryMax: '7,000',
    salaryCurrency: 'USD',
    description: 'Looking for an experienced video editor to join our creative team. You will be responsible for editing YouTube videos, creating engaging content, and working with our content creators.',
    postedAt: '3d ago',
    icon: VideoCameraIcon,
    requirements: [
      'Proficiency in Adobe Premiere Pro and After Effects',
      'At least 2 years of experience editing video content',
      'Understanding of YouTube best practices',
      'Portfolio demonstrating video editing skills',
      'Ability to work to tight deadlines'
    ],
    responsibilities: [
      'Edit raw footage into engaging, high-quality videos',
      'Add effects, graphics, music, and sound design',
      'Collaborate with content creators to realize their vision',
      'Optimize videos for YouTube performance',
      'Stay up-to-date with latest editing techniques and trends'
    ],
    referenceVideos: [
      'https://www.youtube.com/watch?v=example1',
      'https://www.youtube.com/watch?v=example2',
      'https://www.instagram.com/p/example3',
    ]
  },
  {
    id: 2,
    role: 'Graphic Designer',
    company: 'Design Agency Co.',
    companyWebsite: 'https://designagency.com',
    socialMediaUrl: 'https://instagram.com/designagency',
    location: 'New York, NY',
    isRemote: false,
    jobType: 'Contract',
    salaryMin: '4,000',
    salaryMax: '6,000',
    salaryCurrency: 'USD',
    description: 'Seeking a talented graphic designer for branding and marketing projects. You will create visuals for YouTube thumbnails, channel art, and promotional materials for our clients.',
    postedAt: '1w ago',
    icon: PaintBrushIcon,
    requirements: [
      'Expert in Photoshop and Illustrator',
      'Strong understanding of design principles',
      'Experience creating YouTube thumbnails and channel art',
      'Portfolio showing diverse design skills',
      'Ability to iterate based on client feedback'
    ],
    responsibilities: [
      'Design eye-catching YouTube thumbnails',
      'Create channel art and branding elements',
      'Develop promotional materials for social media',
      'Maintain brand consistency across deliverables',
      'Work with clients to understand their needs'
    ],
    referenceVideos: [
      'https://www.youtube.com/watch?v=example1',
      'https://www.instagram.com/p/example2',
    ]
  },
  {
    id: 3,
    role: 'Content Creator',
    company: 'TechTube',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$60,000 - $85,000',
    description: 'Join our team as a technology content creator. You will script, shoot, and edit videos about the latest tech products and trends for our YouTube channel with over 2 million subscribers.',
    postedAt: '2d ago',
    icon: DocumentTextIcon,
    requirements: [
      'Deep knowledge of consumer technology',
      'On-camera presence and communication skills',
      'Experience creating video content',
      'Understanding of YouTube SEO and analytics',
      'Ability to research and stay current on tech trends'
    ],
    responsibilities: [
      'Research and pitch video ideas',
      'Script, shoot, and edit tech review videos',
      'Present tech products in an engaging way',
      'Collaborate with brands on sponsored content',
      'Analyze performance metrics to improve content'
    ]
  },
  {
    id: 4,
    role: 'Motion Graphics Designer',
    company: 'Animation Studios',
    location: 'Los Angeles, CA',
    jobType: 'Full-time',
    salary: '$70,000 - $90,000',
    description: 'Create stunning motion graphics and animations for YouTube content. Experience with After Effects and Cinema 4D required. Join a team working with top creators and brands.',
    postedAt: '5d ago',
    icon: FilmIcon,
    requirements: [
      'Expert in After Effects and Cinema 4D',
      'Understanding of animation principles',
      'Experience with character animation a plus',
      'Portfolio demonstrating motion graphics work',
      'Ability to meet tight deadlines'
    ],
    responsibilities: [
      'Create animated intros, outros, and transitions',
      'Design motion graphics elements for videos',
      'Animate logos and branding elements',
      'Collaborate with editors on visual effects',
      'Stay current with animation trends and techniques'
    ]
  },
  {
    id: 5,
    role: 'YouTube Channel Manager',
    company: 'Influence Media',
    location: 'Remote',
    jobType: 'Part-time',
    salary: '$25-35/hr',
    description: 'Manage all aspects of growing YouTube channels including content planning, SEO optimization, community engagement, and analytics tracking. Looking for someone with proven experience.',
    postedAt: '2w ago',
    icon: UsersIcon,
    requirements: [
      'Proven track record growing YouTube channels',
      'Understanding of YouTube algorithm and best practices',
      'Experience with YouTube analytics and SEO',
      'Strong communication and organization skills',
      'Knowledge of content strategy and planning'
    ],
    responsibilities: [
      'Develop and implement channel growth strategies',
      'Optimize videos for search and discoverability',
      'Manage content calendar and publishing schedule',
      'Engage with audience and build community',
      'Analyze performance metrics and adjust strategy'
    ]
  },
  {
    id: 6,
    role: 'Music Producer',
    company: 'SoundWave Productions',
    location: 'Remote',
    jobType: 'Contract',
    salary: '$45-65/hr',
    description: 'Create original soundtracks and audio for YouTube creators. Experience with digital audio workstations and audio engineering required.',
    postedAt: '1d ago',
    icon: MusicalNoteIcon,
    requirements: [
      'Proficiency in digital audio workstations (Logic Pro, Ableton, etc.)',
      'At least 3 years of music production experience',
      'Knowledge of sound design and audio engineering',
      'Experience creating music for video content',
      'Understanding of copyright and licensing for music'
    ],
    responsibilities: [
      'Compose original music for YouTube videos',
      'Create sound effects and audio elements',
      'Mix and master audio to professional standards',
      'Collaborate with creators to understand their vision',
      'Meet tight deadlines for content production'
    ]
  },
  {
    id: 7,
    role: 'Game Content Creator',
    company: 'GameStream Network',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$55,000 - $75,000',
    description: 'Create gaming content for our YouTube channel with over 1 million subscribers. Extensive knowledge of popular games and strong on-camera presence required.',
    postedAt: '4d ago',
    icon: PuzzlePieceIcon,
    requirements: [
      'Deep knowledge of current gaming trends and popular titles',
      'Strong on-camera personality and communication skills',
      'Experience creating gaming content (streaming, videos, etc.)',
      'Basic video editing skills',
      'Understanding of YouTube gaming community'
    ],
    responsibilities: [
      'Create engaging gameplay videos and commentary',
      'Stay current with new game releases and trends',
      'Interact with viewers and build community',
      'Collaborate with other creators for special content',
      'Maintain consistent posting schedule'
    ]
  },
  {
    id: 8,
    role: 'Videographer',
    company: 'Visual Media Group',
    location: 'Chicago, IL',
    jobType: 'Full-time',
    salary: '$60,000 - $80,000',
    description: 'Shoot high-quality video content for our YouTube network. Experience with professional camera equipment and lighting required.',
    postedAt: '1w ago',
    icon: CameraIcon,
    requirements: [
      'Proficiency with professional camera equipment',
      'Understanding of lighting and composition',
      'Experience with video production workflows',
      'Portfolio demonstrating videography skills',
      'Ability to travel for shoots when needed'
    ],
    responsibilities: [
      'Set up and operate camera equipment for shoots',
      'Design and implement lighting setups',
      'Work with directors to achieve desired visual style',
      'Ensure high-quality footage is captured',
      'Manage equipment and maintain shooting schedule'
    ]
  },
  {
    id: 9,
    role: 'Web Developer',
    company: 'TechTube',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$80,000 - $110,000',
    description: 'Develop and maintain web applications for our content creation platform. Experience with React, Next.js, and API development required.',
    postedAt: '3d ago',
    icon: ComputerDesktopIcon,
    requirements: [
      'Proficiency in React and Next.js',
      'Experience with TypeScript and modern JavaScript',
      'Understanding of REST APIs and data fetching',
      'Knowledge of UI/UX principles and responsive design',
      'Familiarity with version control and CI/CD'
    ],
    responsibilities: [
      'Develop new features for our content platform',
      'Maintain and improve existing codebase',
      'Optimize application performance and accessibility',
      'Collaborate with design and backend teams',
      'Implement and test new functionality'
    ]
  }
]

export default function JobDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    whyInterested: '',
    referenceVideo: '',
    additionalInfo: ''
  })
  const [formErrors, setFormErrors] = useState({
    whyInterested: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [redirectToAuth, setRedirectToAuth] = useState(false)
  const { toasts, addToast, removeToast } = useToasts()

  useEffect(() => {
    // Find job by ID
    const numId = parseInt(id as string)
    const foundJob = jobsData.find(job => job.id === numId)
    
    if (foundJob) {
      setJob(foundJob)
    }
    
    setLoading(false)
    
    // Check for saved application data
    const savedApplication = getJobApplication(id as string)
    if (savedApplication) {
      setFormData(savedApplication)
    }
  }, [id])

  // Handle redirect after form completion if user is not authenticated
  useEffect(() => {
    if (redirectToAuth && status !== 'loading') {
      // Save current form data before redirecting
      saveJobApplication(id as string, formData)
      
      // Redirect to sign in page with callback URL
      const callbackUrl = `/jobs/${id}?apply=true`
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }
  }, [redirectToAuth, status, id, router, formData])

  // Check URL params on load to see if we should open the apply modal
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('apply') === 'true') {
      setIsApplyModalOpen(true)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, resumeFile: file }))
  }

  const validateForm = () => {
    const errors = {
      whyInterested: ''
    }
    let isValid = true

    if (!formData.whyInterested.trim()) {
      errors.whyInterested = 'Please tell us why you are interested in this position'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Save form data regardless of authentication status
    saveJobApplication(id as string, formData)
    addToast('Application data saved', 'info')
    
    // Check if user is authenticated
    if (status !== 'authenticated') {
      // Set flag to redirect to auth page
      setRedirectToAuth(true)
      return
    }
    
    // User is authenticated, proceed with submission
    setSubmitting(true)
    setSubmitError('')
    
    try {
      // Get CSRF token
      const csrfResponse = await fetch('/api/csrf')
      const { csrfToken } = await csrfResponse.json()
      
      // Submit application to API
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({
          jobId: id,
          whyInterested: formData.whyInterested,
          referenceVideo: formData.referenceVideo,
          additionalInfo: formData.additionalInfo
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit application')
      }
      
      // Clear saved application data
      clearJobApplication(id as string)
      addToast('Application submitted successfully', 'success')
      
      setSubmitSuccess(true)
      
      // Reset form after success
      setFormData({
        whyInterested: '',
        referenceVideo: '',
        additionalInfo: ''
      })
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsApplyModalOpen(false)
        setSubmitSuccess(false)
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.')
      addToast('Failed to submit application', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="animate-pulse">
          <div className="h-8 w-2/3 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-white/10 rounded mb-6"></div>
          <div className="h-24 bg-white/10 rounded mb-4"></div>
        </div>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Job Not Found</h1>
          <p className="mt-4 text-lg text-gray-400">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/jobs"
            className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-medium text-black hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </main>
    )
  }

  const JobIcon = job.icon

  // Update the submit button text based on authentication status
  const getSubmitButtonText = () => {
    if (submitting) return 'Submitting...'
    if (status !== 'authenticated') return 'Continue to Sign In'
    return 'Submit Application'
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        {/* Back to Jobs */}
        <div className="mb-8">
          <Link
            href="/jobs"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>
        </div>

        {/* Job Header */}
        <div className="bg-[#111] rounded-xl p-6 mb-10">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0">
              <div className="rounded-full bg-blue-500/10 p-4">
                <JobIcon className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{job.role}</h1>
              <p className="text-gray-400 mb-6">{job.company}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-400">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{job.jobType} {job.isRemote && '• Remote'}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Posted {job.postedAt}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{job.salaryCurrency} {job.salaryMin} - {job.salaryMax} per month</span>
                </div>
                {job.companyWebsite && (
                  <div className="flex items-center text-gray-400">
                    <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      Company Website
                    </a>
                  </div>
                )}
                {job.socialMediaUrl && (
                  <div className="flex items-center text-gray-400">
                    <LinkIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <a href={job.socialMediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      Social Media
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Description</h2>
          <div className="rounded-xl bg-[#111] p-6">
            <p className="text-gray-300">{job.description}</p>
          </div>
        </div>

        {/* Reference Videos */}
        {job.referenceVideos && job.referenceVideos.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Reference Videos</h2>
            <div className="rounded-xl bg-[#111] p-6">
              <div className="space-y-4">
                {job.referenceVideos.map((videoUrl: string, index: number) => (
                  <div key={index}>
                    <a 
                      href={videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <VideoCameraIcon className="h-5 w-5 mr-2" />
                      <span>Reference Video #{index + 1}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex justify-center my-12">
          <button
            type="button"
            className="rounded-full bg-white px-10 py-4 text-base font-medium text-black hover:bg-gray-100"
            onClick={() => setIsApplyModalOpen(true)}
          >
            Apply for this Position
          </button>
        </div>
      </div>

      {/* Application Modal */}
      <Transition appear show={isApplyModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsApplyModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0F0F0F] p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white"
                    >
                      Apply for {job.role} at {job.company}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setIsApplyModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {submitSuccess ? (
                    <div className="bg-green-500/10 text-green-400 p-4 rounded-lg text-center">
                      <h4 className="text-lg font-medium mb-2">Application Submitted!</h4>
                      <p>Thank you for your application. We&apos;ll be in touch soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="whyInterested" className="block text-sm font-medium text-gray-400 mb-1">
                            Why are you interested in this position? <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            id="whyInterested"
                            name="whyInterested"
                            value={formData.whyInterested}
                            onChange={handleInputChange}
                            rows={6}
                            className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                            placeholder="Tell us about your relevant experience, skills, and why you&apos;re excited about this role..."
                          />
                          {formErrors.whyInterested && (
                            <p className="mt-1 text-sm text-red-400">{formErrors.whyInterested}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="referenceVideo" className="block text-sm font-medium text-gray-400 mb-1">
                            Reference Video
                          </label>
                          <input
                            type="url"
                            id="referenceVideo"
                            name="referenceVideo"
                            value={formData.referenceVideo}
                            onChange={handleInputChange}
                            className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                            placeholder="https://www.youtube.com/watch?v=example"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Link to relevant work that showcases your skills for this role
                          </p>
                        </div>

                        <div>
                          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-400 mb-1">
                            Anything else you&apos;d like to mention?
                          </label>
                          <textarea
                            id="additionalInfo"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleInputChange}
                            rows={4}
                            className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                            placeholder="Additional information, availability, questions, etc."
                          />
                        </div>

                        {submitError && (
                          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
                            {submitError}
                          </div>
                        )}

                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-white hover:bg-white/5"
                            onClick={() => setIsApplyModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-100 disabled:bg-white/50 disabled:cursor-not-allowed"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                              </>
                            ) : getSubmitButtonText()}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  )
} 