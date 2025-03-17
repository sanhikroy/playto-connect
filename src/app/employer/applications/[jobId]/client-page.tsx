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
          
          {/* Other components */}
          
          {/* Cover Letter Section */}
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

export default function JobApplicationsClient({ jobId }: { jobId: string }) {
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
          // Sample application data
        ])
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchApplications()
  }, [jobId])

  const updateApplicationStatus = (applicationId: string, newStatus: ApplicationStatus) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* UI components */}
    </main>
  )
} 