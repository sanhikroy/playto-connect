import PocketBase from 'pocketbase';

// Initialize PocketBase client
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

// globally disable auto cancellation
pb.autoCancellation(false);

// Base record type from PocketBase
export interface BaseRecord {
    id: string;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
}

// Type definitions for our collections
export interface UserRecord extends BaseRecord {
    email: string;
    emailVisibility: boolean;
    username?: string;
    verified: boolean;
    name?: string;
    avatar?: string;
    role: 'TALENT' | 'EMPLOYER' | 'PENDING';
}

export interface TalentProfileRecord extends BaseRecord {
    user: string;
    title: string;
    bio: string;
    skills: string[];
    experience: string;
    portfolio_url?: string;
    social_media_url?: string;
    portfolio_videos?: Array<{
        id: string;
        type: string;
        url: string;
    }>;
    is_complete: boolean;
    expand?: {
        user?: UserRecord;
    };
}

export interface EmployerProfileRecord extends BaseRecord {
    user: string;
    company_name: string;
    company_description: string;
    industry: string;
    website: string;
    location: string;
    size: string;
    is_complete: boolean;
}

export interface JobRecord extends BaseRecord {
    title: string;
    description: string;
    requirements: string;
    location: string;
    type: string;
    salary: string;
    employer: string;
    status: 'Active' | 'Draft' | 'Closed';
    is_remote: boolean;
    role: string;
    videos?: string[];
    created: string;
    updated: string;
    expand?: {
        employer?: EmployerProfileRecord;
    };
}

export interface ApplicationRecord extends BaseRecord {
    cover_letter?: string;
    status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
    job: string;
    talent: string;
    expand?: {
        job?: JobRecord;
        talent?: UserRecord;
    };
}