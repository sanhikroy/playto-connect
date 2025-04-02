'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { pb, JobRecord } from '@/lib/pocketbase'
import JobForm, { JobFormData } from '@/components/forms/JobForm'

export default function EditJob({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [jobData, setJobData] = useState<JobFormData | null>(null)

  // Fetch job data on load
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const authData = pb.authStore.model;
        if (!authData) {
          throw new Error('Not authenticated');
        }

        const job = await pb.collection('jobs').getOne<JobRecord>(resolvedParams.id, {
          expand: 'employer'
        });

        // Prepare location data for the form
        let country = '';
        let state = '';
        let city = '';
        
        if (job.location && !job.is_remote && job.location !== "Remote") {
          const locationParts = job.location.split(', ');
          if (locationParts.length === 3) {
            [city, state, country] = locationParts;
          }
        }

        // Videos could be stored as JSON or a regular array
        let videos = [];
        if (typeof job.videos === 'string') {
          try {
            videos = JSON.parse(job.videos);
          } catch {
            videos = [];
          }
        } else if (Array.isArray(job.videos)) {
          videos = job.videos;
        }
        
        // Ensure we have 5 video slots (even if most are empty)
        while (videos.length < 5) {
          videos.push('');
        }

        // Parse salary data
        const { salaryCurrency, salaryMin, salaryMax, salaryFrequency } = parseSalaryString(job.salary || '');

        // Format job data for the form
        setJobData({
          title: job.title || '',
          description: job.description || '',
          requirements: job.requirements || '',
          role: job.role || '',
          isRemote: job.is_remote || false,
          country,
          state,
          city,
          type: job.type || 'Full-time',
          salary: job.salary || '',
          salaryCurrency,
          salaryMin,
          salaryMax,
          salaryFrequency,
          videos,
          assignment: job.assignment || '',
          status: job.status || 'Active'
        });
      } catch (error) {
        console.error('Error fetching job:', error);
        setError(error instanceof Error ? error.message : 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    // Helper function to parse salary string into components
    const parseSalaryString = (salaryString: string): {
      salaryCurrency: string;
      salaryMin: string;
      salaryMax: string;
      salaryFrequency: 'hourly' | 'monthly' | 'annual' | 'project';
    } => {
      let salaryCurrency = '$';
      let salaryMin = '';
      let salaryMax = '';
      let salaryFrequency: 'hourly' | 'monthly' | 'annual' | 'project' = 'annual';
      
      if (!salaryString) {
        return { salaryCurrency, salaryMin, salaryMax, salaryFrequency };
      }
      
      // Extract currency
      const currencyMatch = salaryString.match(/^([^\d]+)/);
      if (currencyMatch && currencyMatch[1]) {
        salaryCurrency = currencyMatch[1];
      }
      
      // Check if we have a range format with currency repeated (like $1000-$2000)
      if (salaryString.includes('-' + salaryCurrency)) {
        const parts = salaryString.split('-' + salaryCurrency);
        if (parts.length === 2) {
          // Extract min from the first part (remove currency)
          const minPart = parts[0].replace(salaryCurrency, '');
          salaryMin = minPart.match(/\d+/)?.[0] || '';
          
          // Extract max from the second part (before any suffix like /month)
          const maxPart = parts[1].split('/')[0].split(' ')[0];
          salaryMax = maxPart.match(/\d+/)?.[0] || '';
        }
      } else {
        // Standard format like $1000-2000
        const rangeMatch = salaryString.match(/(\d+)(?:-(\d+))?/);
        if (rangeMatch) {
          salaryMin = rangeMatch[1] || '';
          salaryMax = rangeMatch[2] || '';
        }
      }
      
      // Extract frequency
      if (salaryString.includes('/hour')) {
        salaryFrequency = 'hourly';
      } else if (salaryString.includes('/month')) {
        salaryFrequency = 'monthly';
      } else if (salaryString.includes('/year')) {
        salaryFrequency = 'annual';
      } else if (salaryString.includes('per project')) {
        salaryFrequency = 'project';
      }
      
      return { salaryCurrency, salaryMin, salaryMax, salaryFrequency };
    };

    fetchJob();
  }, [resolvedParams.id]);

  const handleSubmit = async (formData: JobFormData) => {
    try {
      const authData = pb.authStore.model;
      if (!authData) {
        throw new Error('Not authenticated');
      }

      // Format location string if not remote
      const location = formData.isRemote
        ? "Remote"
        : `${formData.city}, ${formData.state}, ${formData.country}`;

      // Remove empty video URLs
      const videos = formData.videos.filter(url => url.trim() !== '');

      // Update job data
      await pb.collection('jobs').update(resolvedParams.id, {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        role: formData.role,
        location,
        is_remote: formData.isRemote,
        type: formData.type,
        salary: formData.salary,
        videos,
        assignment: formData.assignment,
        status: formData.status
      });

      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/employer/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error updating job:', error);
      setError(error instanceof Error ? error.message : 'Failed to update job');
    }
  };
  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="mb-10">
            <Link
              href="/employer/dashboard"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-2"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          
          <h1 className="text-4xl font-bold tracking-tight text-white">Edit Job</h1>
          <p className="mt-2 text-gray-400">Update your job posting information.</p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-md bg-red-500/10 p-4 text-sm text-red-400">
            {error}
            </div>
          )}
          
          {success && (
          <div className="mb-6 rounded-md bg-green-500/10 p-4 text-sm text-green-400">
            Job updated successfully! Redirecting...
            </div>
          )}
          
        {jobData && (
          <div className="bg-[#111] p-6 sm:p-8 rounded-xl shadow-lg ring-1 ring-white/10">
            <JobForm 
              initialData={jobData} 
              onSubmit={handleSubmit}
              submitButtonLabel="Update Job"
              isEmployer={true}
            />
              </div>
            )}
      </div>
    </main>
  )
} 