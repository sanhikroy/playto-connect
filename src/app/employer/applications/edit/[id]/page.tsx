'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

// Application status types
type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected'

// Application interface
interface Application {
  id: string
  applicantName: string
  applicantEmail: string
  jobTitle: string
  submittedDate: string
  coverLetter: string
  resumeUrl: string
  status: ApplicationStatus
  notes?: string
}

export default function EditApplication() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    status: 'pending' as ApplicationStatus,
    notes: ''
  })
  
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        // In a real app, this would fetch from an API
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock application data
        const mockApplication: Application = {
          id: params.id as string,
          applicantName: 'John Smith',
          applicantEmail: 'john.smith@example.com',
          jobTitle: 'Senior Video Editor',
          submittedDate: '2023-06-15',
          coverLetter: 'I am passionate about video editing and have 5 years of experience working with major brands. I believe my skills in Adobe Premiere Pro and After Effects make me a great fit for this position.',
          resumeUrl: '/resume.pdf',
          status: 'reviewing',
          notes: 'Candidate has good experience but need to verify previous projects.'
        }
        
        setApplication(mockApplication)
        setFormData({
          status: mockApplication.status,
          notes: mockApplication.notes || ''
        })
      } catch (error) {
        console.error('Error fetching application:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchApplication()
  }, [params.id])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? value as ApplicationStatus : value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setApplication(prev => {
        if (!prev) return null
        return {
          ...prev,
          status: formData.status,
          notes: formData.notes
        }
      })
      
      setSuccess(true)
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error updating application:', error)
    } finally {
      setSaving(false)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }
  
  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
      case 'reviewing':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-400" />
    }
  }
  
  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending Review'
      case 'reviewing':
        return 'In Review'
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Rejected'
    }
  }
  
  const getStatusClass = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
      case 'reviewing':
        return 'bg-yellow-400/10 text-yellow-400'
      case 'accepted':
        return 'bg-green-400/10 text-green-400'
      case 'rejected':
        return 'bg-red-400/10 text-red-400'
    }
  }
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-white/10 rounded mb-8"></div>
            <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
            <div className="h-40 bg-white/10 rounded mb-6"></div>
            <div className="h-60 bg-white/10 rounded"></div>
          </div>
        </div>
      </main>
    )
  }
  
  if (!application) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Application Not Found</h1>
            <p className="mt-4 text-lg text-gray-400">The application you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/employer/dashboard"
              className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-medium text-black hover:bg-gray-100"
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        <div className="mb-8">
          <Link
            href={`/employer/applications/${application.id.split('-')[0]}`}
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Applications
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Edit Application</h1>
        <h2 className="text-lg text-gray-400 mb-8">For {application.jobTitle}</h2>
        
        {success && (
          <div className="mb-6 bg-green-500/10 text-green-400 p-4 rounded-lg">
            Application updated successfully!
          </div>
        )}
        
        <div className="bg-[#111] rounded-xl p-6 mb-8">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Name</p>
                <p className="text-white">{application.applicantName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Email</p>
                <p className="text-white">{application.applicantEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Submitted Date</p>
                <p className="text-white">{formatDate(application.submittedDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Current Status</p>
                <div className="flex items-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{getStatusLabel(application.status)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Cover Letter</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-line">{application.coverLetter}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Resume</h3>
            <a 
              href={application.resumeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-lg px-4 py-2"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              View Resume
            </a>
          </div>
          
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-medium text-white mb-4">Update Application</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
                  Application Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                >
                  <option value="pending">Pending Review</option>
                  <option value="reviewing">In Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-400/50 sm:text-sm"
                  placeholder="Add private notes about this applicant..."
                ></textarea>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-white px-4 py-3 text-base font-medium text-black hover:bg-gray-100 disabled:bg-white/50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 