'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  ChevronDownIcon, 
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { pb, JobRecord, ApplicationRecord, UserRecord } from '@/lib/pocketbase'
import { format } from 'date-fns'

// Application status types matching the PocketBase schema
type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'

// Extended Application interface with expanded user data
interface ApplicationWithUser extends ApplicationRecord {
  expand: {
    talent: UserRecord;
    job?: JobRecord;
  }
}

// Format date helper function
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

// Profile Modal Component
const ProfileModal = ({ application, isOpen, onClose, onStatusChange }: { 
  application: ApplicationWithUser | null, 
  isOpen: boolean, 
  onClose: () => void,
  onStatusChange: (id: string, status: ApplicationStatus) => void
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative p-4 min-h-screen flex items-center justify-center">
        <div className="relative bg-[#0A0A0A] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 mx-auto">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold text-white mb-4">Application Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Applicant Info */}
          <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-start">
              <div className="mr-4">
                {application.expand.talent.avatar ? (
                  <img 
                    src={application.expand.talent.avatar} 
                    alt={application.expand.talent.name || 'User'} 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-16 w-16 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{application.expand.talent.name}</h3>
                <div className="flex items-center text-sm text-gray-400 mb-1">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  {application.expand.talent.email}
                </div>
                <div className="text-sm text-gray-400">
                  Applied on {formatDate(application.created)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Cover Letter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Cover Letter</h3>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <p className="text-gray-300 whitespace-pre-wrap">{application.cover_letter}</p>
            </div>
          </div>
          
          {/* Status Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Application Status</h3>
            <div className="flex space-x-3">
              <button 
                onClick={() => onStatusChange(application.id, 'PENDING')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  application.status === 'PENDING' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Pending
              </button>
              <button 
                onClick={() => onStatusChange(application.id, 'REVIEWING')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  application.status === 'REVIEWING' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <PencilSquareIcon className="h-4 w-4 inline mr-1" />
                Reviewing
              </button>
              <button 
                onClick={() => onStatusChange(application.id, 'ACCEPTED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  application.status === 'ACCEPTED' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                Accept
              </button>
              <button 
                onClick={() => onStatusChange(application.id, 'REJECTED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  application.status === 'REJECTED' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <XCircleIcon className="h-4 w-4 inline mr-1" />
                Reject
              </button>
            </div>
          </div>
          
          {/* Contact Button */}
          <div className="flex justify-end">
            <a 
              href={`mailto:${application.expand.talent.email}`} 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Contact Applicant
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface JobApplicationsClientProps {
  jobId: string;
}

export default function JobApplicationsClient({ jobId }: JobApplicationsClientProps) {
  const [job, setJob] = useState<JobRecord | null>(null)
  const [applications, setApplications] = useState<ApplicationWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithUser | null>(null)
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  
  // Add a useEffect to handle click outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('.status-dropdown-content');
      dropdowns.forEach(dropdown => {
        if (!dropdown.classList.contains('hidden')) {
          const target = event.target as Node;
          if (dropdown.parentNode && !dropdown.parentNode.contains(target)) {
            dropdown.classList.add('hidden');
          }
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const fetchApplications = async () => {
    try {
      setLoading(true)
      
      // Fetch job details
      const jobData = await pb.collection('jobs').getOne<JobRecord>(jobId, {
        expand: 'employer'
      })
      setJob(jobData)
      
      // Fetch applications for this job
      const applicationsResponse = await pb.collection('applications').getList<ApplicationWithUser>(1, 100, {
        filter: `job = "${jobId}"`,
        expand: 'talent',
        sort: '-created'
      })

      setApplications(applicationsResponse.items)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchApplications()
  }, [jobId])

  // Handle status change
  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await pb.collection('applications').update(applicationId, {
        status: newStatus
      })
      
      // Update the application in the state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      )
      
      // Update selected application if it's the one being modified
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

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
          <p className="text-gray-400 mb-6">{job.is_remote ? 'Remote' : job.location} · {job.type}</p>
          
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
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'PENDING' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilterStatus('REVIEWING')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'REVIEWING' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Reviewing
              </button>
              <button 
                onClick={() => setFilterStatus('ACCEPTED')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'ACCEPTED' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                Accepted
              </button>
              <button 
                onClick={() => setFilterStatus('REJECTED')}
                className={`px-3 py-1 text-sm rounded-full ${filterStatus === 'REJECTED' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
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
                        {application.expand.talent.avatar ? (
                          <img 
                            src={application.expand.talent.avatar} 
                            alt={application.expand.talent.name || 'User'} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="h-12 w-12 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{application.expand.talent.name || 'Unnamed Applicant'}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {application.expand.talent.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Applied on {formatDate(application.created)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Status indicator */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${application.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-400' : 
                          application.status === 'REVIEWING' ? 'bg-blue-900/30 text-blue-400' :
                          application.status === 'ACCEPTED' ? 'bg-green-900/30 text-green-400' :
                          'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {application.status === 'PENDING' && <ClockIcon className="h-3 w-3 mr-1" />}
                        {application.status === 'REVIEWING' && <PencilSquareIcon className="h-3 w-3 mr-1" />}
                        {application.status === 'ACCEPTED' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                        {application.status === 'REJECTED' && <XCircleIcon className="h-3 w-3 mr-1" />}
                        {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
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
                      <div className="relative inline-block text-left" style={{ position: 'static' }}>
                        <button
                          onClick={(e) => {
                            // Toggle current dropdown
                            const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                            if (dropdown) {
                              // Close all other dropdowns first
                              document.querySelectorAll('.status-dropdown-content').forEach(el => {
                                if (el !== dropdown) el.classList.add('hidden');
                              });
                              
                              // Toggle this dropdown
                              const isHidden = dropdown.classList.toggle('hidden');
                              
                              // Position dropdown if now visible
                              if (!isHidden) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                dropdown.style.top = `${rect.bottom + 5}px`;
                                // Position right edge of dropdown at right edge of button
                                dropdown.style.right = `${window.innerWidth - rect.right}px`;
                                // Remove left positioning
                                dropdown.style.left = '';
                              }
                            }
                          }}
                          className="inline-flex justify-center px-2 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-800 focus:outline-none"
                        >
                          <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
                        </button>
                        
                        <div className="status-dropdown-content hidden fixed mt-1 w-48 bg-[#0A0A0A] border border-gray-800 rounded-md shadow-lg" style={{ zIndex: 9999, maxHeight: '12rem', overflow: 'auto' }}>
                          <div className="py-1">
                            <button
                              onClick={() => {
                                handleStatusChange(application.id, 'PENDING');
                                const activeElement = document.activeElement;
                                if (activeElement instanceof HTMLElement) {
                                  activeElement.blur();
                                }
                                document.querySelectorAll('.status-dropdown-content').forEach(el => {
                                  el.classList.add('hidden');
                                });
                              }}
                              className="text-gray-300 flex w-full items-center px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                            >
                              <ClockIcon className="mr-2 h-4 w-4 text-yellow-400" aria-hidden="true" />
                              Mark as Pending
                            </button>
                            
                            <button
                              onClick={() => {
                                handleStatusChange(application.id, 'REVIEWING');
                                const activeElement = document.activeElement;
                                if (activeElement instanceof HTMLElement) {
                                  activeElement.blur();
                                }
                                document.querySelectorAll('.status-dropdown-content').forEach(el => {
                                  el.classList.add('hidden');
                                });
                              }}
                              className="text-gray-300 flex w-full items-center px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                            >
                              <PencilSquareIcon className="mr-2 h-4 w-4 text-blue-400" aria-hidden="true" />
                              Mark as Reviewing
                            </button>
                            
                            <button
                              onClick={() => {
                                handleStatusChange(application.id, 'ACCEPTED');
                                const activeElement = document.activeElement;
                                if (activeElement instanceof HTMLElement) {
                                  activeElement.blur();
                                }
                                document.querySelectorAll('.status-dropdown-content').forEach(el => {
                                  el.classList.add('hidden');
                                });
                              }}
                              className="text-gray-300 flex w-full items-center px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                            >
                              <CheckCircleIcon className="mr-2 h-4 w-4 text-green-400" aria-hidden="true" />
                              Accept Application
                            </button>
                            
                            <button
                              onClick={() => {
                                handleStatusChange(application.id, 'REJECTED');
                                const activeElement = document.activeElement;
                                if (activeElement instanceof HTMLElement) {
                                  activeElement.blur();
                                }
                                document.querySelectorAll('.status-dropdown-content').forEach(el => {
                                  el.classList.add('hidden');
                                });
                              }}
                              className="text-gray-300 flex w-full items-center px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                            >
                              <XCircleIcon className="mr-2 h-4 w-4 text-red-400" aria-hidden="true" />
                              Reject Application
                            </button>
                          </div>
                        </div>
                      </div>
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
          <p className="text-gray-400">Job not found or you do not have permission to view applications.</p>
        </div>
      )}
      
      {/* Profile Modal */}
      <ProfileModal 
        application={selectedApplication} 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </main>
  )
} 