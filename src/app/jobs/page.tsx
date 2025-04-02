'use client'

import { useState, useEffect } from 'react'
import { 
  VideoCameraIcon, 
  PaintBrushIcon, 
  FilmIcon, 
  UsersIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PuzzlePieceIcon,
  CameraIcon,
  ComputerDesktopIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { pb } from '@/lib/pocketbase'
import { LoadingSpinner } from '@/lib/utils/loadingStates'

interface Role {
  id: string;
  name: string;
  slug: string;
  status: boolean;
}

interface Employer {
  company_name: string;
  company_description: string;
  industry: string;
  website: string;
  location: string;
  size: string;
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
  collectionId?: string;
  collectionName?: string;
  expand?: {
    employer_id?: Employer;
  };
}

const locations = [
  { id: 'all', name: 'All Locations' },
  { id: 'remote', name: 'Remote' },
  { id: 'onsite', name: 'Onsite' },
]

const jobTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'full-time', name: 'Full-time' },
  { id: 'part-time', name: 'Part-time' },
  { id: 'contract', name: 'Contract' },
  { id: 'internship', name: 'Internship' },
]

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

// Helper function to format salary
const formatSalary = (salaryStr: string | undefined | null) => {
  if (!salaryStr) return 'Salary not specified'
  
  // Our new salary format will be like "$50000-$75000/year" or "$25/hour"
  // Make it more readable by adding commas to numbers over 1000
  // e.g., "$50,000-$75,000/year" or "$25/hour"
  
  return salaryStr.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// Helper function to format job type display name
const formatJobType = (type: string) => {
  // Convert 'full-time' to 'Full-time', 'part-time' to 'Part-time', etc.
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('-')
}

export default function JobsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedJobType, setSelectedJobType] = useState('all')
  const [jobs, setJobs] = useState<JobWithEmployer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const perPage = 9

  // Fetch roles
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await pb.collection('role').getList(1, 100);
        const roleItems = response.items.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          status: item.status
        })) as Role[];
        
        setRoles([
          { id: 'all', name: 'All Roles', slug: 'all', status: true },
          ...roleItems
        ]);
      } catch (err) {
        console.error('Error fetching roles:', err)
      }
    }

    fetchRoles()
  }, [])

  // Fetch jobs from custom API with filters
  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.append('page', currentPage.toString())
        params.append('per_page', perPage.toString())
        
        if (selectedRole !== 'all') {
          const roleSlug = roles.find(r => r.id === selectedRole)?.slug
          if (roleSlug) params.append('role', roleSlug)
        }
        
        if (selectedLocation !== 'all') {
          params.append('remote', (selectedLocation === 'remote').toString())
        }
        
        if (selectedJobType !== 'all') {
          const jobTypeName = jobTypes.find(t => t.id === selectedJobType)?.name
          if (jobTypeName) params.append('type', jobTypeName)
        }
        
        // Use direct fetch instead of PocketBase to avoid any transformations
        const response = await fetch(`${pb.baseUrl}/api/custom/jobs-with-employers?${params.toString()}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // The API returns the correct structure directly
        if (result && result.items && Array.isArray(result.items)) {
          // Ensure we only show exactly 9 items per page, even if API returns more
          const limitedItems = result.items.slice(0, perPage)
          setJobs(limitedItems)
          setTotalJobs(result.total_items)
        } else {
          setJobs([])
          setTotalJobs(0)
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setJobs([])
        setTotalJobs(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage, selectedRole, selectedLocation, selectedJobType, roles])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  if (isLoading && roles.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        {/* Search header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Browse Jobs
          </h1>
          <p className="mt-3 text-lg leading-8 text-gray-400">
            Find the perfect creative opportunity that matches your skills and interests.
          </p>
        </div>

        {/* Filter form */}
        <div className="mb-10">
          <div className="bg-[#111] rounded-xl p-6">
            <div className="mb-4 flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-white mr-2" />
              <h2 className="text-lg font-medium text-white">Filter Jobs</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Role filter */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 pr-8 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm relative z-20 appearance-none"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ backgroundColor: '#111', color: 'white' }}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id} style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Location filter */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 pr-8 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm relative z-20 appearance-none"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  style={{ backgroundColor: '#111', color: 'white' }}
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id} style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Job Type filter */}
              <div>
                <label htmlFor="job-type" className="block text-sm font-medium text-gray-400 mb-1">
                  Job Type
                </label>
                <select
                  id="job-type"
                  name="job-type"
                  className="block w-full rounded-lg border-0 bg-white/5 px-4 pr-8 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/20 sm:text-sm relative z-20 appearance-none"
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  style={{ backgroundColor: '#111', color: 'white' }}
                >
                  {jobTypes.map((jobType) => (
                    <option key={jobType.id} value={jobType.id} style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                      {jobType.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Job listings in a grid layout - 3 per row */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your filters to find more opportunities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {jobs.map((job) => {
              const roleId = job.role?.toLowerCase().replace(/\s+/g, '-')
              const JobIcon = roleIcons[roleId as keyof typeof roleIcons] || DocumentTextIcon;
              
              return (
                <div key={job.id} className="rounded-xl bg-[#111] p-6 shadow-lg ring-1 ring-white/10 hover:bg-white/10 transition-colors duration-200 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-blue-500/10 p-3 flex-shrink-0">
                      <JobIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white truncate">{job.title}</h2>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-3">
                    {job.company_name || 'Company Name'}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-4">
                    <span>{job.location || (job.is_remote ? 'Remote' : 'Onsite')}</span>
                    <span>•</span>
                    <span>{formatJobType(job.type)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                      {formatSalary(job.salary)}
                    </span>
                    
                    <Link 
                      href={`/jobs/${job.id}`}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20 transition-all duration-200"
                    >
                      More Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">{(currentPage - 1) * perPage + 1}</span> to{' '}
                  <span className="font-medium text-white">{Math.min(currentPage * perPage, totalJobs)}</span> of{' '}
                  <span className="font-medium text-white">{totalJobs}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage * perPage >= totalJobs}
                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 