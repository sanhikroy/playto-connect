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
          {/* Modal content here */}
        </div>
      </div>
    </div>
  );
};

interface JobApplicationsClientProps {
  jobId: string;
}

export default function JobApplicationsClient({ jobId }: JobApplicationsClientProps) {
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
          id: jobId,
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
            coverLetter: 'I am writing to express my interest...',
            resumeUrl: '/resumes/james-wilson.pdf',
            status: 'pending'
          },
          // More application data
        ])
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchApplications()
  }, [jobId])

  // Filter applications based on status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus)

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <Link href="/employer/jobs" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6">
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to jobs
      </Link>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : job ? (
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{job.title} - Applications</h1>
          <p className="text-gray-400 mb-6">{job.location} · {job.type}</p>
          
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'all' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilterStatus('reviewing')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'reviewing' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Reviewing
              </button>
              <button 
                onClick={() => setFilterStatus('accepted')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'accepted' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Accepted
              </button>
              <button 
                onClick={() => setFilterStatus('rejected')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Rejected
              </button>
            </div>
          </div>
          
          {/* Applications list */}
          {filteredApplications.length > 0 ? (
            <div className="bg-[#0A0A0A] rounded-xl overflow-hidden shadow">
              {filteredApplications.map((application) => (
                <div key={application.id} className="p-4 border-b border-gray-800 hover:bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <UserCircleIcon className="h-12 w-12 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{application.applicantName}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {application.applicantEmail}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Status indicator */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${application.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                          application.status === 'reviewing' ? 'bg-blue-900/30 text-blue-400' :
                          application.status === 'accepted' ? 'bg-green-900/30 text-green-400' :
                          'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {application.status === 'pending' && <ClockIcon className="h-3 w-3 mr-1" />}
                        {application.status === 'reviewing' && <PencilSquareIcon className="h-3 w-3 mr-1" />}
                        {application.status === 'accepted' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                        {application.status === 'rejected' && <XCircleIcon className="h-3 w-3 mr-1" />}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      
                      {/* Review button */}
                      <button
                        onClick={() => {
                          setSelectedApplication(application)
                          setIsProfileModalOpen(true)
                        }}
                        className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
                      >
                        Review
                      </button>
                      
                      {/* Status dropdown */}
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button className="inline-flex justify-center w-full px-2 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-800 focus:outline-none">
                            <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#0A0A0A] shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {/* Dropdown items here */}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0A0A0A] rounded-xl p-8 text-center">
              <p className="text-gray-400">No applications found matching the current filter.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0A0A0A] rounded-xl p-8 text-center">
          <p className="text-gray-400">Job not found.</p>
        </div>
      )}
      
      {/* Profile modal */}
      <ProfileModal 
        application={selectedApplication}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </main>
  )
} 