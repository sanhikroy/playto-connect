import JobApplicationsClient from './JobApplicationsClient'

// Next.js 15 server component with minimal typing
export default function JobApplicationsPage({ params }: { params: { jobId: string } }) {
  return <JobApplicationsClient jobId={params.jobId} />
} 