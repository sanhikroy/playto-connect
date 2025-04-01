'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  // BuildingOfficeIcon,
  // PencilSquareIcon,
  // DocumentPlusIcon,
  // UserGroupIcon,
  // ChartBarIcon,
  // EyeIcon,
  // TrashIcon,
  PlusIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import { pb, JobRecord, ApplicationRecord, EmployerProfileRecord } from '@/lib/pocketbase'

interface Job {
  id: string
  title: string
  location: string
  type: string
  postedDate: string
  applicationsCount: number
  status: 'Active' | 'Draft' | 'Closed'
}

interface ApplicationSummary {
  totalApplications: number
  newApplications: number
  inReview: number
  accepted: number
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applicationStats, setApplicationStats] = useState<ApplicationSummary | null>(null)
  const [companyProfile, setCompanyProfile] = useState<EmployerProfileRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get the current authenticated user
        const authData = pb.authStore.model;
        if (!authData) {
          throw new Error('Not authenticated');
        }

        // Fetch employer profile
        const profileRecord = await pb.collection('employer_profiles').getFirstListItem<EmployerProfileRecord>(
          `user = "${authData.id}"`,
          {
            expand: 'user'
          }
        );
        setCompanyProfile(profileRecord);

        // Fetch jobs for this employer
        const jobsList = await pb.collection('jobs').getList<JobRecord>(1, 50, {
          filter: `employer = "${authData.id}"`,
          sort: '-created',
          expand: 'employer'
        });

        // Transform jobs data
        const transformedJobs = jobsList.items.map(job => ({
          id: job.id,
          title: job.title,
          location: job.location || 'Remote',
          type: job.type,
          postedDate: job.created,
          applicationsCount: 0, // Will be updated with actual count
          status: job.status || 'Draft' // Provide default status with capital D
        }));

        // Fetch applications for all jobs
        const applications = await pb.collection('applications').getList<ApplicationRecord>(1, 100, {
          filter: jobsList.items.map(job => `job = "${job.id}"`).join('||'),
          expand: 'job'
        });

        // Update jobs with application counts
        const jobsWithCounts = transformedJobs.map(job => ({
          ...job,
          applicationsCount: applications.items.filter(app => app.job === job.id).length
        }));

        setJobs(jobsWithCounts);

        // Calculate application statistics
        const stats = {
          totalApplications: applications.items.length,
          newApplications: applications.items.filter(app => app.status === 'PENDING').length,
          inReview: applications.items.filter(app => app.status === 'REVIEWING').length,
          accepted: applications.items.filter(app => app.status === 'ACCEPTED').length
        };
        setApplicationStats(stats);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }
  
  // Function to get status badge class
  const getStatusClass = (status: Job['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-400/10 text-green-400'
      case 'Draft':
        return 'bg-yellow-400/10 text-yellow-400'
      case 'Closed':
        return 'bg-red-400/10 text-red-400'
      default:
        return 'bg-gray-400/10 text-gray-400'
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-white/10 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-white/10 rounded"></div>
              ))}
            </div>
            <div className="h-8 w-1/4 bg-white/10 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Employer Dashboard</h1>
        
        {/* Application Statistics */}
        {applicationStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#111] rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-white">{applicationStats.totalApplications}</p>
            </div>
            <div className="bg-[#111] rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">New Applications</p>
              <p className="text-2xl font-bold text-white">{applicationStats.newApplications}</p>
            </div>
            <div className="bg-[#111] rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">In Review</p>
              <p className="text-2xl font-bold text-white">{applicationStats.inReview}</p>
            </div>
            <div className="bg-[#111] rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Accepted</p>
              <p className="text-2xl font-bold text-white">{applicationStats.accepted}</p>
            </div>
          </div>
        )}
        
        {/* Job Listings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Your Job Listings</h2>
            <Link 
              href="/post-job" 
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Post New Job
            </Link>
          </div>
          
          <div className="bg-[#111] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Posted
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Applications
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center text-white">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                        {formatDate(job.postedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                        <Link 
                          href={`/employer/applications/${job.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {job.applicationsCount}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-4">
                          <Link 
                            href={`/employer/jobs/${job.id}/edit`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit Job
                          </Link>
                          <Link 
                            href={`/employer/applications/${job.id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View Applications
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Company Profile */}
        <div className="bg-[#111] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Company Profile</h2>
            <Link 
              href="/employer/company/edit" 
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Edit Profile
            </Link>
          </div>
          <p className="text-gray-400 mb-4">
            Keep your company information up to date to attract the best talent.
          </p>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white mr-4">
              <BuildingOffice2Icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-white font-medium">{companyProfile?.company_name || 'Your Company'}</h3>
              <p className="text-gray-400 text-sm">
                {companyProfile?.location || 'Location'} • {companyProfile?.industry || 'Industry'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 