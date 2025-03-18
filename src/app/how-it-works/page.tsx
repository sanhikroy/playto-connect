import Link from 'next/link'

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How Playto Connect Works
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Connecting talented YouTube creators with great opportunities
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-3">
          {/* For Talents */}
          <div className="rounded-2xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
            <h2 className="text-2xl font-bold mb-4">For Talents</h2>
            <ol className="space-y-6 text-gray-300">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</span>
                <div>
                  <strong className="block font-semibold">Create Your Profile</strong>
                  <span>Showcase your skills, experience, and portfolio to stand out.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">2</span>
                <div>
                  <strong className="block font-semibold">Browse Opportunities</strong>
                  <span>Find projects and jobs that match your expertise and interests.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">3</span>
                <div>
                  <strong className="block font-semibold">Apply and Connect</strong>
                  <span>Submit applications and connect directly with employers.</span>
                </div>
              </li>
            </ol>
          </div>

          {/* For Employers */}
          <div className="rounded-2xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
            <h2 className="text-2xl font-bold mb-4">For Employers</h2>
            <ol className="space-y-6 text-gray-300">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">1</span>
                <div>
                  <strong className="block font-semibold">Post a Job</strong>
                  <span>Create detailed job listings with your requirements and expectations.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">2</span>
                <div>
                  <strong className="block font-semibold">Review Applications</strong>
                  <span>Browse applications from talented creators and review their portfolios.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">3</span>
                <div>
                  <strong className="block font-semibold">Hire and Collaborate</strong>
                  <span>Connect with your chosen talent and start your project.</span>
                </div>
              </li>
            </ol>
          </div>

          {/* Benefits */}
          <div className="rounded-2xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
            <h2 className="text-2xl font-bold mb-4">Benefits</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 flex-none text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Direct connections between creators and employers</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 flex-none text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Specialized platform for YouTube content creation</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 flex-none text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Portfolio showcase for creators</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 flex-none text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Streamlined hiring process</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-6 w-6 flex-none text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Industry-specific opportunities</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="rounded-full bg-white px-8 py-3 text-base font-medium text-black hover:bg-gray-100 transition-all duration-200"
            >
              Create an Account
            </Link>
            <Link 
              href="/" 
              className="rounded-full bg-white/10 px-8 py-3 text-base font-medium text-white hover:bg-white/20 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 