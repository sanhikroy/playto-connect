declare module '@/types/models' {
  export type UserRole = 'TALENT' | 'EMPLOYER'
  export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'

  export interface User {
    id: string
    name: string | null
    email: string
    password: string
    role: UserRole
    hasCompletedProfile: boolean
    emailVerified: Date | null
    createdAt: Date
    updatedAt: Date
    talentProfile?: TalentProfile
    employerProfile?: EmployerProfile
    jobs?: Job[]
    applications?: Application[]
  }

  export interface TalentProfile {
    id: string
    userId: string
    title: string
    bio: string
    skills: string
    experience: string
    portfolioUrl: string | null
    socialMediaUrl: string | null
    isComplete: boolean
    createdAt: Date
    updatedAt: Date
    user: User
  }

  export interface EmployerProfile {
    id: string
    userId: string
    companyName: string
    companyDescription: string
    industry: string
    website: string
    location: string
    size: string
    isComplete: boolean
    createdAt: Date
    updatedAt: Date
    user: User
  }

  export interface Job {
    id: string
    title: string
    description: string
    requirements: string
    salary: string | null
    location: string | null
    isRemote: boolean
    type: string
    role: string
    createdAt: Date
    updatedAt: Date
    employerId: string
    employer: User
    applications: Application[]
  }

  export interface Application {
    id: string
    coverLetter: string | null
    status: ApplicationStatus
    createdAt: Date
    updatedAt: Date
    jobId: string
    job: Job
    talentId: string
    talent: User
  }
} 