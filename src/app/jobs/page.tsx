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

const roles = [
  { id: 'all', name: 'All Roles' },
  { id: 'video-editor', name: 'Video Editor' },
  { id: 'graphic-designer', name: 'Graphic Designer' },
  { id: 'content-creator', name: 'Content Creator' },
  { id: 'motion-graphics', name: 'Motion Graphics Designer' },
  { id: 'channel-manager', name: 'YouTube Channel Manager' },
  { id: 'music-producer', name: 'Music Producer' },
  { id: 'game-creator', name: 'Game Content Creator' },
  { id: 'videographer', name: 'Videographer' },
  { id: 'web-developer', name: 'Web Developer' },
]

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

const jobs = [
  {
    id: 1,
    role: 'Video Editor',
    roleId: 'video-editor',
    company: 'Creative Studios Inc.',
    location: 'Remote',
    locationId: 'remote',
    jobType: 'Full-time',
    jobTypeId: 'full-time',
    salary: '$50,000 - $70,000',
    description: 'Looking for an experienced video editor to join our creative team. You will be responsible for editing YouTube videos, creating engaging content, and working with our content creators.',
    postedAt: '3d ago',
    icon: VideoCameraIcon
  },
  {
    id: 2,
    role: 'Graphic Designer',
    roleId: 'graphic-designer',
    company: 'Design Agency Co.',
    location: 'New York, NY',
    locationId: 'onsite',
    jobType: 'Contract',
    jobTypeId: 'contract',
    salary: '$40-60/hr',
    description: 'Seeking a talented graphic designer for branding and marketing projects. You will create visuals for YouTube thumbnails, channel art, and promotional materials for our clients.',
    postedAt: '1w ago',
    icon: PaintBrushIcon
  },
  {
    id: 3,
    role: 'Content Creator',
    roleId: 'content-creator',
    company: 'TechTube',
    location: 'Remote',
    locationId: 'remote',
    jobType: 'Full-time',
    jobTypeId: 'full-time',
    salary: '$60,000 - $85,000',
    description: 'Join our team as a technology content creator. You will script, shoot, and edit videos about the latest tech products and trends for our YouTube channel with over 2 million subscribers.',
    postedAt: '2d ago',
    icon: DocumentTextIcon
  },
  {
    id: 4,
    role: 'Motion Graphics Designer',
    roleId: 'motion-graphics',
    company: 'Animation Studios',
    location: 'Los Angeles, CA',
    locationId: 'onsite',
    jobType: 'Full-time',
    jobTypeId: 'full-time',
    salary: '$70,000 - $90,000',
    description: 'Create stunning motion graphics and animations for YouTube content. Experience with After Effects and Cinema 4D required. Join a team working with top creators and brands.',
    postedAt: '5d ago',
    icon: FilmIcon
  },
  {
    id: 5,
    role: 'YouTube Channel Manager',
    roleId: 'channel-manager',
    company: 'Influence Media',
    location: 'Remote',
    locationId: 'remote',
    jobType: 'Part-time',
    jobTypeId: 'part-time',
    salary: '$25-35/hr',
    description: 'Manage all aspects of growing YouTube channels including content planning, SEO optimization, community engagement, and analytics tracking. Looking for someone with proven experience.',
    postedAt: '2w ago',
    icon: UsersIcon
  },
  {
    id: 6,
    role: 'Music Producer',
    roleId: 'music-producer',
    company: 'SoundWave Productions',
    location: 'Remote',
    locationId: 'remote',
    jobType: 'Contract',
    jobTypeId: 'contract',
    salary: '$45-65/hr',
    description: 'Create original soundtracks and audio for YouTube creators. Experience with digital audio workstations and audio engineering required.',
    postedAt: '1d ago',
    icon: MusicalNoteIcon
  },
  {
    id: 7,
    role: 'Game Content Creator',
    roleId: 'game-creator',
    company: 'GameStream Network',
    location: 'Remote',
    locationId: 'remote',
    jobType: 'Full-time',
    jobTypeId: 'full-time',
    salary: '$55,000 - $75,000',
    description: 'Create gaming content for our YouTube channel with over 1 million subscribers. Extensive knowledge of popular games and strong on-camera presence required.',
    postedAt: '4d ago',
    icon: PuzzlePieceIcon
  },
  {
    id: 8,
    role: 'Videographer',
    roleId: 'videographer',
    company: 'Visual Media Group',
    location: 'Chicago, IL',
    locationId: 'onsite',
    jobType: 'Full-time',
    jobTypeId: 'full-time',
    salary: '$60,000 - $80,000',
    description: 'Shoot high-quality video content for our YouTube network. Experience with professional camera equipment and lighting required.',
    postedAt: '1w ago',
    icon: CameraIcon
  },
  {
    id: 9,
    role: 'Web Developer',
    roleId: 'web-developer',
    company: 'TechTube',
    location: 'Remote',
    locationId: 'remote',
    jobType: 'Full-time',
    jobTypeId: 'full-time',
    salary: '$80,000 - $110,000',
    description: 'Develop and maintain web applications for our content creation platform. Experience with React, Next.js, and API development required.',
    postedAt: '3d ago',
    icon: ComputerDesktopIcon
  }
]

export default function JobsPage() {
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedJobType, setSelectedJobType] = useState('all')
  const [filteredJobs, setFilteredJobs] = useState(jobs)

  useEffect(() => {
    let result = [...jobs]
    
    if (selectedRole !== 'all') {
      result = result.filter(job => job.roleId === selectedRole)
    }
    
    if (selectedLocation !== 'all') {
      result = result.filter(job => job.locationId === selectedLocation)
    }
    
    if (selectedJobType !== 'all') {
      result = result.filter(job => job.jobTypeId === selectedJobType)
    }
    
    setFilteredJobs(result)
  }, [selectedRole, selectedLocation, selectedJobType])

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
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your filters to find more opportunities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredJobs.map((job) => {
              const JobIcon = job.icon;
              
              return (
                <div key={job.id} className="rounded-xl bg-[#111] p-6 shadow-lg ring-1 ring-white/10 hover:bg-white/10 transition-colors duration-200 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-blue-500/10 p-3 flex-shrink-0">
                      <JobIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white truncate">{job.role}</h2>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-3">{job.company}</div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-4">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                      {job.salary}
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
        {filteredJobs.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{filteredJobs.length}</span> of{' '}
                  <span className="font-medium text-white">{filteredJobs.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="relative z-10 inline-flex items-center bg-blue-500/10 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 