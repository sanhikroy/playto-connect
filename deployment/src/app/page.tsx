'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [perspective, setPerspective] = useState<'talent' | 'employer'>('employer')

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <div className="relative isolate">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(0, 0, 255, 0.15), transparent 50%)',
          }}
        />
        
        {/* Hero content */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Talent category icons */}
            <div className="flex justify-center gap-10 mb-12">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <span className="text-sm text-white/60">Video Editors</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </div>
                <span className="text-sm text-white/60">Writers</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                </div>
                <span className="text-sm text-white/60">Designers</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                </div>
                <span className="text-sm text-white/60">Animators</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
                <span className="text-sm text-white/60">Strategists</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Where top creative talent
              <br />
              meets opportunity
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
              Connect with top creative professionals for your projects. Find video editors, graphic designers, writers, animators, and more.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/jobs"
                className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black hover:bg-gray-100 transition-all duration-200"
              >
                Find a Job
              </Link>
              <Link
                href="/post-job"
                className="rounded-full bg-white/10 px-8 py-3 text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-white/60">Find Talent Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to hire creative professionals
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Playto Connect makes it easy to find and hire the best creative talent for your projects.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  {feature.icon}
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* How it Works section */}
      <div id="how-it-works" className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-white/10">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-white/60">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How Playto Connect Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            A streamlined process for both talent and employers
          </p>
        </div>

        {/* Perspective Toggle */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex rounded-full p-1 bg-white/5 ring-1 ring-white/10">
            <button 
              onClick={() => setPerspective('talent')}
              className={`px-8 py-2 text-sm font-medium rounded-full min-w-[140px] transition-colors ${
                perspective === 'talent' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
              }`}
            >
              For Talent
            </button>
            <button 
              onClick={() => setPerspective('employer')}
              className={`px-8 py-2 text-sm font-medium rounded-full min-w-[140px] transition-colors ${
                perspective === 'employer' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
              }`}
            >
              For Employers
            </button>
          </div>
        </div>

        {/* For Talent Steps */}
        <div className={perspective === 'talent' ? 'block' : 'hidden'}>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <span className="text-lg font-semibold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white">Create Your Profile</h3>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  Showcase your best work, highlight your skills, and set your rates. Build a portfolio that stands out.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <span className="text-lg font-semibold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white">Browse Opportunities</h3>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  Find projects that match your expertise. Our smart matching system helps you discover relevant opportunities.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <span className="text-lg font-semibold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white">Connect & Create</h3>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  Apply to projects, discuss details with clients, and start creating amazing work together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Employers Steps */}
        <div className={perspective === 'employer' ? 'block' : 'hidden'}>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <span className="text-lg font-semibold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white">Post Your Project</h3>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  Describe your project needs, timeline, and budget. Our smart matching system will help you find the right talent.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <span className="text-lg font-semibold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white">Review Portfolios</h3>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  Browse through curated portfolios of verified creative professionals and find the perfect match for your project.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <span className="text-lg font-semibold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white">Collaborate & Create</h3>
                <p className="mt-2 text-base leading-7 text-gray-400">
                  Connect directly, discuss details, and work together to bring your creative vision to life.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center gap-x-6">
          <Link
            href="/jobs"
            className={`rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 ${
              perspective === 'talent' 
                ? 'bg-white text-black hover:bg-gray-100' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Find a Job
          </Link>
          <Link
            href="/post-job"
            className={`rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 ${
              perspective === 'employer' 
                ? 'bg-white text-black hover:bg-gray-100' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Post a Job
          </Link>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-24 sm:mt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl bg-white/5 px-8 py-16 ring-1 ring-white/10 sm:px-12 sm:py-20 lg:px-16 rounded-3xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to find amazing creative talent?
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Join thousands of businesses who have found their perfect creative match on Playto Connect.
              </p>
              <div className="mt-8 flex justify-center gap-x-6">
                <Link
                  href="/jobs"
                  className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black hover:bg-gray-100 transition-all duration-200"
                >
                  Find a Job
                </Link>
                <Link
                  href="/post-job"
                  className="rounded-full bg-white/10 px-8 py-3 text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 sm:mt-32 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-sm leading-6 text-gray-400 hover:text-white">
              About
            </Link>
            <Link href="/terms" className="text-sm leading-6 text-gray-400 hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm leading-6 text-gray-400 hover:text-white">
              Privacy
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} Playto Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    name: 'Verified Portfolios',
    description: 'Every creative professional is verified and their work samples are reviewed for quality.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/60">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    name: 'Secure Messaging',
    description: 'Built-in messaging system to communicate with talent directly through the platform.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/60">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    name: 'Testimonials',
    description: 'Read verified reviews and testimonials from previous clients to make informed hiring decisions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/60">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
]
