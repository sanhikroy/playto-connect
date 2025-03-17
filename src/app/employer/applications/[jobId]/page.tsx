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

interface JobApplicationsPageProps {
  params: {
    jobId: string;
  };
}

export default function JobApplications(props: JobApplicationsPageProps) {
  const { params } = props;
  const jobId = params.jobId;
  
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

  // Rest of the component code...
  
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* UI components */}
    </main>
  )
} 