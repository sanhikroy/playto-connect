export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface Application {
  id: string;
  job: string;
  talent: string;
  cover_letter: string;
  reference_video?: string;
  additional_info?: string;
  status: ApplicationStatus;
  created: string;
  updated: string;
} 