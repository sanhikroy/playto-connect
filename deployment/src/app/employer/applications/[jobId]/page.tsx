'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  ChevronDownIcon, 
  EnvelopeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

// Application status types
type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected'

// Application interface
interface Application {
  id: string
  applicantName: string
  applicantEmail: string
  submittedDate: string
  coverLetter: string
  resumeUrl: string
  status: ApplicationStatus
  notes?: string
}

// Job interface
interface Job {
  id: string
  title: string
  location: string
  type: string
  postedDate: string
}

// Profile Modal Component
const ProfileModal = ({ application, isOpen, onClose }: { 
  application: Application | null, 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative p-4 min-h-screen flex items-center justify-center">
        <div className="relative bg-[#0A0A0A] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 mx-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
          
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            <div className="relative mr-6">
              <div className="h-24 w-24 bg-gray-800 rounded-full overflow-hidden">
                {application.applicantName.split(' ').map(name => name[0]).join('')}
                <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                  {application.applicantName.split(' ').map(name => name[0]).join('')}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 bg-gray-800 rounded-full text-white border border-gray-700">
                {application.applicantName.split(' ')[0]}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{application.applicantName}</h2>
              <p className="text-xl text-gray-400">Senior Video Editor</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#111] rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-1">87+</div>
              <div className="text-gray-400">Completed Projects</div>
            </div>
            <div className="bg-[#111] rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-1">5+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
          </div>
          
          {/* Contact Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <a href="#" className="flex items-center justify-center rounded-lg bg-[#111] p-3 hover:bg-[#1a1a1a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-white">Portfolio</span>
            </a>
            <a href="#" className="flex items-center justify-center rounded-lg bg-[#111] p-3 hover:bg-[#1a1a1a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-white">Social</span>
            </a>
            <a href={`mailto:${application.applicantEmail}`} className="flex items-center justify-center rounded-lg bg-[#111] p-3 hover:bg-[#1a1a1a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-white">Email</span>
            </a>
            <a href="#" className="flex items-center justify-center rounded-lg bg-[#111] p-3 hover:bg-[#1a1a1a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              </svg>
              <span className="text-white">WhatsApp</span>
            </a>
          </div>
          
          {/* About Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">About</h3>
            <div className="bg-[#111] rounded-xl p-6">
              <p className="text-gray-300">
                Experienced video editor with over 5 years of experience working with YouTube creators and brands. Specializing in dynamic editing, motion graphics, and storytelling that engages viewers and delivers results. I have a passion for creating visually compelling content that helps creators grow their audience and businesses tell their stories effectively.
              </p>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Skills</h3>
            <div className="bg-[#111] rounded-xl p-6">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">Adobe Premiere Pro</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">After Effects</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">DaVinci Resolve</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">Final Cut Pro</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">Motion Graphics</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">Color Grading</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">Sound Design</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">Storytelling</span>
                <span className="bg-[#1d1d1d] rounded-md px-3 py-1.5 text-sm text-blue-400">YouTube Content Creation</span>
              </div>
            </div>
          </div>
          
          {/* Portfolio Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative rounded-xl overflow-hidden group">
                <img src="https://via.placeholder.com/640x360" alt="Portfolio thumbnail" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3 opacity-100 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-white mb-1">YouTube Video</span>
                </div>
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 rounded-full p-3 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden group">
                <img src="https://via.placeholder.com/640x360" alt="Portfolio thumbnail" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3 opacity-100 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-white mb-1">YouTube Video</span>
                </div>
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 rounded-full p-3 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden group">
                <img src="https://via.placeholder.com/640x360" alt="Portfolio thumbnail" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3 opacity-100 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-white mb-1">Instagram Post</span>
                </div>
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 rounded-full p-3 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Cover Letter Section - Hidden by default */}
          <div className="mt-8 border-t border-white/10 pt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Cover Letter</h3>
              <div className="bg-[#1d1d1d] text-gray-400 px-3 py-1 rounded-full text-sm">Application #{application.id}</div>
            </div>
            <div className="bg-[#111] rounded-xl p-6">
              <p className="text-gray-300 whitespace-pre-line">{application.coverLetter}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function JobApplications({ params }: { params: { jobId: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // In a real app, this would fetch from an API
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock job data
        setJob({
          id: params.jobId,
          title: 'Senior Video Editor',
          location: 'Remote',
          type: 'Full-time',
          postedDate: '2023-06-15',
        })
        
        // Mock applications data
        setApplications([
          {
            id: '1',
            applicantName: 'James Wilson',
            applicantEmail: 'james.wilson@example.com',
            submittedDate: '2023-06-16',
            coverLetter: 'I am writing to express my interest in the Senior Video Editor position at CreativeMinds Studios. With over 7 years of experience in video editing, including work with major YouTubers and brands, I believe I would be a valuable addition to your team.\n\nMy expertise includes Adobe Premiere Pro, After Effects, and DaVinci Resolve. I specialize in creating dynamic editing styles that engage viewers and help creators grow their audiences. In my current role, I\'ve helped increase view retention by 40% through innovative editing techniques.',
            resumeUrl: '/resumes/james-wilson.pdf',
            status: 'pending'
          },
          {
            id: '2',
            applicantName: 'Sarah Johnson',
            applicantEmail: 'sarah.j@example.com',
            submittedDate: '2023-06-17',
            coverLetter: 'I am excited to apply for the Senior Video Editor position. With 5 years of experience in content creation and editing for various platforms including YouTube, Instagram, and TikTok, I have developed a strong understanding of what makes content engaging and successful.\n\nI am proficient in Adobe Premiere Pro, After Effects, and Final Cut Pro. My previous work has been featured on channels with over 1 million subscribers, and I have helped optimize content for algorithm success.',
            resumeUrl: '/resumes/sarah-johnson.pdf',
            status: 'reviewing'
          },
          {
            id: '3',
            applicantName: 'Michael Chen',
            applicantEmail: 'michael.c@example.com',
            submittedDate: '2023-06-18',
            coverLetter: 'I would like to apply for the Senior Video Editor position at your company. My background in film and digital media has prepared me well for this role. I have worked with a variety of clients, from small businesses to large corporations, creating content that meets their specific needs and objectives.\n\nI am skilled in Adobe Creative Suite, with a focus on Premiere Pro and After Effects. I also have experience with color grading in DaVinci Resolve and audio editing in Audition.',
            resumeUrl: '/resumes/michael-chen.pdf',
            status: 'accepted'
          },
          {
            id: '4',
            applicantName: 'Emily Rodriguez',
            applicantEmail: 'emily.r@example.com',
            submittedDate: '2023-06-20',
            coverLetter: 'I am writing to apply for the Senior Video Editor position. As a creative professional with 6 years of experience in video production and editing, I am confident in my ability to bring value to your team.\n\nMy skills include advanced editing techniques, motion graphics creation, and sound design. I have worked on a variety of projects, from short-form content for social media to long-form documentaries and promotional videos.',
            resumeUrl: '/resumes/emily-rodriguez.pdf',
            status: 'rejected'
          }
        ])
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchApplications()
  }, [params.jobId])
  
  // Function to update application status
  const updateApplicationStatus = (applicationId: string, newStatus: ApplicationStatus) => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus } 
          : app
      )
    )
    
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication(prev => 
        prev ? { ...prev, status: newStatus } : null
      )
    }
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }
  
  // Function to get status badge
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-400">
            <ClockIcon className="h-3.5 w-3.5" />
            Pending
          </span>
        )
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400">
            <DocumentTextIcon className="h-3.5 w-3.5" />
            Reviewing
          </span>
        )
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400">
            <CheckCircleIcon className="h-3.5 w-3.5" />
            Accepted
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400">
            <XCircleIcon className="h-3.5 w-3.5" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }
  
  // Filter applications by status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus)
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-1/4 bg-white/10 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <div className="h-12 bg-white/10 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-white/10 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="h-64 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  if (!job) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Job Not Found</h1>
            <p className="text-gray-400 mb-8">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/employer/dashboard"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-100"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="mb-8">
          <Link
            href="/employer/dashboard"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{job.title}</h1>
          <p className="mt-2 text-gray-400">
            {job.location} • Posted {formatDate(job.postedDate)}
          </p>
        </div>
        
        {/* CRM View / Kanban Board */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Applications</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-400">View:</span>
              <div className="relative z-10 inline-flex shadow-sm rounded-md">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`relative inline-flex items-center justify-center px-3 py-1.5 rounded-l-md border min-w-[76px] ${
                    filterStatus === 'all' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  } text-sm font-medium focus:z-10 focus:outline-none`}
                >
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('pending')}
                  className={`relative -ml-px inline-flex items-center justify-center px-3 py-1.5 rounded-r-md border min-w-[76px] ${
                    filterStatus !== 'all' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  } text-sm font-medium focus:z-10 focus:outline-none`}
                >
                  Pipeline
                </button>
              </div>
            </div>
          </div>
          
          {filterStatus !== 'all' ? (
            <div className="grid grid-cols-4 gap-4">
              {/* Pending Column */}
              <div className="bg-[#111] rounded-xl p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('applicationId');
                  updateApplicationStatus(id, 'pending');
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-yellow-400" />
                    Pending
                  </h3>
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded">
                    {applications.filter(a => a.status === 'pending').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {applications.filter(a => a.status === 'pending').map((application) => (
                    <div 
                      key={application.id}
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsProfileModalOpen(true);
                      }}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('applicationId', application.id);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedApplication?.id === application.id 
                          ? 'bg-blue-500/10 border border-blue-500/50' 
                          : 'bg-[#1a1a1a] hover:bg-[#222]'
                      }`}
                    >
                      <div className="font-medium text-white">{application.applicantName}</div>
                      <div className="text-xs text-gray-400">Applied {formatDate(application.submittedDate)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviewing Column */}
              <div className="bg-[#111] rounded-xl p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('applicationId');
                  updateApplicationStatus(id, 'reviewing');
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-1 text-blue-400" />
                    Reviewing
                  </h3>
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded">
                    {applications.filter(a => a.status === 'reviewing').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {applications.filter(a => a.status === 'reviewing').map((application) => (
                    <div 
                      key={application.id}
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsProfileModalOpen(true);
                      }}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('applicationId', application.id);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedApplication?.id === application.id 
                          ? 'bg-blue-500/10 border border-blue-500/50' 
                          : 'bg-[#1a1a1a] hover:bg-[#222]'
                      }`}
                    >
                      <div className="font-medium text-white">{application.applicantName}</div>
                      <div className="text-xs text-gray-400">Applied {formatDate(application.submittedDate)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Accepted Column */}
              <div className="bg-[#111] rounded-xl p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('applicationId');
                  updateApplicationStatus(id, 'accepted');
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1 text-green-400" />
                    Accepted
                  </h3>
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded">
                    {applications.filter(a => a.status === 'accepted').length}
                </span>
                </div>
                <div className="space-y-3">
                  {applications.filter(a => a.status === 'accepted').map((application) => (
                    <div 
                      key={application.id}
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsProfileModalOpen(true);
                      }}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('applicationId', application.id);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedApplication?.id === application.id 
                          ? 'bg-blue-500/10 border border-blue-500/50' 
                          : 'bg-[#1a1a1a] hover:bg-[#222]'
                      }`}
                    >
                      <div className="font-medium text-white">{application.applicantName}</div>
                      <div className="text-xs text-gray-400">Applied {formatDate(application.submittedDate)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rejected Column */}
              <div className="bg-[#111] rounded-xl p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('applicationId');
                  updateApplicationStatus(id, 'rejected');
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1 text-red-400" />
                    Rejected
                  </h3>
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded">
                    {applications.filter(a => a.status === 'rejected').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {applications.filter(a => a.status === 'rejected').map((application) => (
                    <div 
                      key={application.id}
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsProfileModalOpen(true);
                      }}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('applicationId', application.id);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedApplication?.id === application.id 
                          ? 'bg-blue-500/10 border border-blue-500/50' 
                          : 'bg-[#1a1a1a] hover:bg-[#222]'
                      }`}
                    >
                      <div className="font-medium text-white">{application.applicantName}</div>
                      <div className="text-xs text-gray-400">Applied {formatDate(application.submittedDate)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Applications List */}
              <div className="col-span-1">            
                <div className="mb-4">
                  <div className="w-full">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
                      className="block w-full rounded-lg border-0 bg-[#111] px-4 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8 bg-[#111] rounded-xl">
                  <p className="text-gray-400">No applications found</p>
                </div>
              ) : (
                  <div className="space-y-3">
                    {filteredApplications.map((application) => (
                  <div 
                    key={application.id}
                    onClick={() => setSelectedApplication(application)}
                    className={`p-4 rounded-xl cursor-pointer transition ${
                      selectedApplication?.id === application.id 
                        ? 'bg-blue-500/10 border border-blue-500/50' 
                        : 'bg-[#111] hover:bg-[#1a1a1a]'
                    }`}
                  >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-white">{application.applicantName}</div>
                          {getStatusBadge(application.status)}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Applied {formatDate(application.submittedDate)}
                      </div>
                      </div>
                    ))}
                  </div>
              )}
          </div>
          
          {/* Right Column - Application Details */}
          <div className="col-span-2">
            {selectedApplication ? (
              <div className="bg-[#111] rounded-xl p-6">
                    {/* Application Header with Name and Controls */}
                <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-3">{selectedApplication.applicantName}</h2>
                      <div className="flex flex-wrap items-center gap-4">
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value as ApplicationStatus)}
                          className="block rounded-lg border-0 bg-[#111] px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                        
                    <button
                          onClick={() => setIsProfileModalOpen(true)}
                      className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                    >
                          <UserCircleIcon className="h-4 w-4 mr-1.5" />
                          Open Full Profile
                    </button>
                  </div>
                </div>
                
                    {/* Cover Letter - Full Length */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Cover Letter</h3>
                  <div className="bg-white/5 rounded-lg p-4 text-gray-300">
                        <p className="whitespace-pre-line">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#111] rounded-xl p-8 text-center">
                    <div className="mx-auto h-16 w-16 text-gray-400">
                      <DocumentTextIcon className="h-full w-full" />
                </div>
                    <h3 className="mt-4 text-xl font-medium text-white">No Application Selected</h3>
                    <p className="mt-2 text-gray-400">
                  Select an application from the list to view details
                </p>
              </div>
            )}
          </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal 
        application={selectedApplication} 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </main>
  )
} 