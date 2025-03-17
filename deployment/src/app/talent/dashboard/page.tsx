'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  UserCircleIcon, 
  PencilSquareIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  ArrowRightIcon,
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Application {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'
  appliedAt: string
}

interface Profile {
  name: string
  title: string
  completionPercentage: number
  profilePicture?: string
}

export default function TalentDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileRes = await fetch('/api/talent/profile');
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          
          // Calculate profile completion percentage
          const requiredFields = ['title', 'bio', 'skills', 'experience'];
          const completedFields = requiredFields.filter(field => 
            profileData[field] && 
            (typeof profileData[field] === 'string' ? 
              profileData[field].trim() !== '' : 
              Array.isArray(profileData[field]) ? 
                profileData[field].length > 0 : 
                true
            )
          );
          
          const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
          
        setProfile({
            name: profileData.name || 'Talent',
            title: profileData.title || 'Add your professional title',
            completionPercentage,
            profilePicture: profileData.profilePicture
          });
        }
        
        // Fetch applications data
        const applicationsRes = await fetch('/api/talent/applications');
        
        if (applicationsRes.ok) {
          const applicationsData = await applicationsRes.json();
          setApplications(applicationsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-400/20">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        )
      case 'REVIEWING':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
            <DocumentTextIcon className="h-3 w-3 mr-1" />
            Reviewing
          </span>
        )
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Accepted
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/20">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-white/10 rounded mb-8"></div>
            <div className="h-32 bg-white/10 rounded-xl mb-8"></div>
            <div className="h-8 w-32 bg-white/10 rounded mb-4"></div>
            <div className="h-64 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Talent Dashboard</h1>
        
        {/* Profile summary */}
        <div className="mb-8">
          <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-white/10 mr-4 flex items-center justify-center overflow-hidden">
                  {profile?.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt={profile?.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-14 w-14 text-gray-400" />
                  )}
                </div>
              <div>
                <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
                <p className="text-gray-400">{profile?.title}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link 
                  href="/talent/profile/edit"
                  className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-1" />
                  Edit Profile
                </Link>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Profile Completion</p>
              <div className="w-full bg-white/5 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${profile?.completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{profile?.completionPercentage}% Complete</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link
                href="/talent/profile/view"
                className="inline-flex items-center rounded-lg bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
              >
                <UserCircleIcon className="h-4 w-4 mr-1" />
                View Profile
              </Link>
              
              <Link
                href="/talent/jobs"
                className="inline-flex items-center rounded-lg bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
              >
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Applications</h2>
            <Link
              href="/talent/applications"
              className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center"
            >
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {applications.length === 0 ? (
            <div className="bg-[#111] rounded-xl p-6 shadow-lg ring-1 ring-white/10 text-center">
              <p className="text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
                  <Link
                href="/talent/jobs"
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition-all duration-200"
                  >
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                Browse Available Jobs
                  </Link>
                </div>
          ) : (
            <div className="bg-[#111] rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Job
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Applied
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {applications.slice(0, 5).map((application) => (
                      <tr key={application.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {application.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {application.companyName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(application.appliedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Link
                            href={`/talent/applications/${application.id}`}
                            className="text-blue-400 hover:text-blue-300"
                >
                            View
                </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
          )}
        </div>
      </div>
    </main>
  )
} 