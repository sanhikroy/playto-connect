'use client'

import { Fragment, useState } from 'react'
import { Dialog, Popover, Transition } from '@headlessui/react'
import Link from 'next/link'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isHomepage = pathname === '/'
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    if (isHomepage) {
      e.preventDefault()
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  // Function to get the dashboard link based on user role
  const getDashboardLink = () => {
    if (!session) return '/talent/dashboard'
    return session.user.role === 'EMPLOYER' ? '/employer/dashboard' : '/talent/dashboard'
  }

  return (
    <header className="absolute w-full z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-white">Playto Connect</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          <Link href="/jobs" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Find a Job
          </Link>
          <Link href="/post-job" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Post a Job
          </Link>
          <Link 
            href={isHomepage ? '#how-it-works' : '/#how-it-works'} 
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            onClick={handleHowItWorksClick}
          >
            How it Works
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
          {isLoading ? (
            <div className="h-10 w-24 bg-white/5 rounded-full animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <Link
                href={getDashboardLink()}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Popover className="relative">
                <Popover.Button className="flex items-center gap-x-1 text-sm font-medium leading-6 text-white/80 hover:text-white transition-colors outline-none">
                  <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
                  <span>{session?.user?.name || 'Account'}</span>
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#111] p-2 shadow-lg ring-1 ring-white/10 focus:outline-none">
                    <div className="py-1">
                      <Link
                        href={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-md"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/settings/profile"
                        className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-md"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-md"
                      >
                        Sign out
                      </button>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-gray-100 transition-all duration-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[#0A0A0A] px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-white">Playto Connect</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                <Link
                  href="/jobs"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                >
                  Find a Job
                </Link>
                <Link
                  href="/post-job"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                >
                  Post a Job
                </Link>
                <Link
                  href={isHomepage ? '#how-it-works' : '/#how-it-works'}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                  onClick={handleHowItWorksClick}
                >
                  How it Works
                </Link>
              </div>
              <div className="py-6">
                {isLoading ? (
                  <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse"></div>
                ) : isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 mb-4">
                      <div className="flex items-center">
                        <UserCircleIcon className="h-6 w-6 text-white mr-2" aria-hidden="true" />
                        <span className="text-base font-medium text-white">{session?.user?.name || 'Account'}</span>
                      </div>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings/profile"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="-mx-3 w-full text-left block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="-mx-3 block rounded-lg px-3 py-2.5 mt-2 text-base font-medium text-center bg-white text-black hover:bg-gray-100"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
} 