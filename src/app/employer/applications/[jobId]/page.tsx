// Basic Next.js dynamic page component
import JobApplicationsClient from './JobApplicationsClient'

type Props = {
  params: {
    jobId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function Page(props: Props) {
  return <JobApplicationsClient jobId={props.params.jobId} />;
} 