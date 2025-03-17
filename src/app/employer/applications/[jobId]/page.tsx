import JobApplicationsClient from './JobApplicationsClient'
import { Metadata } from 'next'

// Use the correct Next.js types for page params
type Params = {
  jobId: string
}

// Next.js 15 page component with proper typing
export default async function JobApplicationsPage({ params }: { params: Params }) {
  // Parse the job ID from params
  const jobId = params.jobId

  return <JobApplicationsClient jobId={jobId} />
} 