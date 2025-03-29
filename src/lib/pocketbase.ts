import PocketBase from 'pocketbase';

// Initialize PocketBase client
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

// Type definitions for our collections
export interface UserRecord {
    id: string;
    email: string;
    name?: string;
    role: 'TALENT' | 'EMPLOYER';
    hasCompletedProfile: boolean;
    created: string;
    updated: string;
}

export interface TalentProfileRecord {
    id: string;
    user: string; // relation to users collection
    title: string;
    bio: string;
    skills: string[]; // JSON array of skills
    experience: string;
    portfolioUrl?: string;
    socialMediaUrl?: string;
    profilePicture?: string;
    portfolioVideos?: string[]; // JSON array of video URLs
    isComplete: boolean;
    created: string;
    updated: string;
}

export interface EmployerProfileRecord {
    id: string;
    user: string; // relation to users collection
    companyName: string;
    companyDescription: string;
    industry: string;
    website: string;
    location: string;
    size: string;
    isComplete: boolean;
    created: string;
    updated: string;
}

export interface JobRecord {
    id: string;
    employer: string; // relation to users collection
    title: string;
    description: string;
    requirements: string;
    salary?: string;
    location?: string;
    isRemote: boolean;
    type: string;
    role: string;
    created: string;
    updated: string;
}

export interface ApplicationRecord {
    id: string;
    job: string; // relation to jobs collection
    talent: string; // relation to users collection
    coverLetter?: string;
    status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
    created: string;
    updated: string;
}

// Helper type for PocketBase record responses
export type RecordModel = {
    id: string;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
}; 