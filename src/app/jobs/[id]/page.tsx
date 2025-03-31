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
import { useAuth } from '@/components/providers/AuthProvider'
import { saveJobApplication, getJobApplication, clearJobApplication } from '@/lib/utils/formStorage'
import { useToasts, ToastContainer } from '@/components/notifications/Toasts'
import { pb } from '@/lib/pocketbase'
import { ClientResponseError } from 'pocketbase'
import { ApplicationStatus } from '@/types/application'

interface Employer {
  id: string;
  company_name: string;
  company_description: string;
  industry: string;
  website: string;
  location: string;
  size: string;
  social_media?: string;
}

interface JobWithEmployer {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  is_remote: boolean;
  type: string;
  role: string;
  created: string;
  updated: string;
  employer_id: string;
  company_name: string;
  company_description: string;
  industry: string;
  website: string;
  employer_location: string;
  size: string;
  social_media?: string;
  collectionId: string;
  collectionName: string;
  expand?: {
    employer_id?: Employer;
  };
}

const roleIcons = {
  'video-editor': VideoCameraIcon,
  'graphic-designer': PaintBrushIcon,
  'content-creator': DocumentTextIcon,
  'motion-graphics': FilmIcon,
  'channel-manager': UsersIcon,
  'music-producer': MusicalNoteIcon,
  'game-creator': PuzzlePieceIcon,
  'videographer': CameraIcon,
  'web-developer': ComputerDesktopIcon,
}

export default function JobDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()
  const [job, setJob] = useState<JobWithEmployer | null>(null)
  const [loading, setLoading] = useState(true)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
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
    async function fetchJob() {
      try {
        const record = await pb.collection('jobs').getOne(id as string, {
          expand: 'employer_id',
          requestKey: `getJob_${id}`
        });

        // Check if user has already applied
        if (isAuthenticated && user?.id) {
          const applications = await pb.collection('applications').getList(1, 1, {
            filter: `job = "${id}" && talent = "${user.id}"`,
          });
          setHasApplied(applications.totalItems > 0);
        }

        // Transform the response to match our expected format
        const transformedJob: JobWithEmployer = {
          id: record.id,
          title: record.title,
          description: record.description,
          requirements: record.requirements,
          salary: record.salary,
          location: record.location,
          is_remote: record.is_remote,
          type: record.type,
          role: record.role,
          created: record.created,
          updated: record.updated,
          employer_id: record.employer_id,
          company_name: record.expand?.employer_id?.company_name || '',
          company_description: record.expand?.employer_id?.company_description || '',
          industry: record.expand?.employer_id?.industry || '',
          website: record.expand?.employer_id?.website || '',
          employer_location: record.expand?.employer_id?.location || '',
          size: record.expand?.employer_id?.size || '',
          social_media: record.expand?.employer_id?.social_media,
          collectionId: record.collectionId,
          collectionName: record.collectionName,
          expand: record.expand ? {
            employer_id: record.expand.employer_id as Employer
          } : undefined
        };

        setJob(transformedJob)
      } catch (err) {
        // Ignore auto-cancellation errors
        if (err instanceof ClientResponseError && err.status === 0) {
          return;
        }
        console.error('Error fetching job:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
    
    // Check for saved application data
    const savedApplication = getJobApplication(id as string)
    if (savedApplication) {
      setFormData(savedApplication)
    }

    // Cancel any pending requests when unmounting
    return () => {
      pb.cancelRequest(`getJob_${id}`);
    };
  }, [id]);

  // Handle redirect after form completion if user is not authenticated
  useEffect(() => {
    if (redirectToAuth && !isLoading) {
      // Save current form data before redirecting
      saveJobApplication(id as string, formData)
      
      // Redirect to sign in page with callback URL
      const callbackUrl = `/jobs/${id}?apply=true`
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }
  }, [redirectToAuth, isLoading, id, router, formData]);

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
    if (!isAuthenticated) {
      // Set flag to redirect to auth page
      setRedirectToAuth(true)
      return
    }
    
    // User is authenticated, proceed with submission
    setSubmitting(true)
    setSubmitError('')
    
    try {
      // Submit application to API
      const response = await pb.collection('applications').create({
        job: id,
        talent: user?.id,
        cover_letter: formData.whyInterested,
        status: ApplicationStatus.PENDING,
        // Only include additional fields if they have content
        ...(formData.referenceVideo && { reference_video: formData.referenceVideo }),
        ...(formData.additionalInfo && { additional_info: formData.additionalInfo })
      })
      
      if (!response) {
        throw new Error('Failed to submit application')
      }

      // Clear saved application data
      clearJobApplication(id as string)
      
      // Show success message and close modal
      setSubmitSuccess(true)
      addToast('Application submitted successfully!', 'success')
      setTimeout(() => {
        setIsApplyModalOpen(false)
        setSubmitSuccess(false)
        // Redirect to dashboard after success message
        router.push('/talent/dashboard')
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitError('Failed to submit application. Please try again.')
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

  const JobIcon = roleIcons[job.role as keyof typeof roleIcons] || DocumentTextIcon

  // Update the submit button text based on authentication status
  const getSubmitButtonText = () => {
    if (submitting) return 'Submitting...'
    if (submitSuccess) return 'Application Submitted!'
    if (!isAuthenticated) return 'Sign in to Apply'
    return 'Submit Application'
  }

  // Format the posted date
  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return `${Math.floor(diffDays / 30)}mo ago`
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
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <p className="text-gray-400 mb-6">{job.company_name}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                <div className="flex items-center text-gray-400">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="capitalize">{job.type} {job.is_remote && '• Remote'}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Posted {formatPostedDate(job.created)}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{job.salary}</span>
                </div>
                {job.website && (
                  <div className="flex items-center text-gray-400">
                    <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <a href={job.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      Company Website
                    </a>
                  </div>
                )}
                {job.social_media && (
                  <div className="flex items-center text-gray-400">
                    <LinkIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <a href={job.social_media} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
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
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Reference Videos</h2>
          <div className="rounded-xl bg-[#111] p-6">
            <div className="space-y-4">
              <div>
                <a 
                  href="#"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  <span>Reference Video #1</span>
                </a>
              </div>
              <div>
                <a 
                  href="#"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  <span>Reference Video #2</span>
                </a>
              </div>
              <div>
                <a 
                  href="#"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  <span>Reference Video #3</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex justify-center my-12">
          {hasApplied ? (
            <Link
              href="/talent/dashboard"
              className="inline-flex justify-center rounded-full bg-white/10 px-10 py-4 text-base font-medium text-white hover:bg-white/20 transition-colors"
            >
              View Application Status
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-full bg-white px-10 py-4 text-base font-medium text-black hover:bg-gray-100"
              onClick={() => setIsApplyModalOpen(true)}
            >
              Apply for this Position
            </button>
          )}
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
                      Apply for {job.title} at {job.company_name}
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