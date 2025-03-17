// Basic Next.js dynamic page component
import JobApplicationsClient from './JobApplicationsClient'

type Props = {
  params: Promise<{
    jobId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page(props: Props) {
  const { jobId } = await props.params;
  return <JobApplicationsClient jobId={jobId} />;
} 