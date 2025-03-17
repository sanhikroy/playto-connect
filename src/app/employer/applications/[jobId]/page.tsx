import JobApplicationsClient from './JobApplicationsClient'

// Page props interface for Next.js pages
interface PageProps {
  params: {
    jobId: string;
  }
}

// Server component
export default function JobApplicationsPage({ params }: PageProps) {
  return <JobApplicationsClient jobId={params.jobId} />
} 