/**
 * Utilities for storing form data temporarily in localStorage
 * Used for progressive engagement flows where users fill forms before authentication
 */

// Keys for different form types
export const STORAGE_KEYS = {
  JOB_POST: 'temp_job_post',
  JOB_APPLICATION: 'temp_job_application',
};

/**
 * Save form data to localStorage
 * @param key Storage key identifier
 * @param data Form data to store
 * @param expiration Optional expiration time in minutes (default: 60)
 */
export function saveFormData(key: string, data: any, expiration: number = 60): void {
  try {
    // Add expiration timestamp (current time + expiration in minutes)
    const storageData = {
      data,
      expires: Date.now() + expiration * 60 * 1000,
    };
    
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
}

/**
 * Retrieve form data from localStorage
 * @param key Storage key identifier
 * @returns The stored form data or null if not found or expired
 */
export function getFormData(key: string): any | null {
  try {
    const storedData = localStorage.getItem(key);
    
    if (!storedData) return null;
    
    const { data, expires } = JSON.parse(storedData);
    
    // Check if data has expired
    if (Date.now() > expires) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error retrieving form data from localStorage:', error);
    return null;
  }
}

/**
 * Clear stored form data
 * @param key Storage key identifier
 */
export function clearFormData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing form data from localStorage:', error);
  }
}

/**
 * Store job application data with the job ID
 * @param jobId ID of the job being applied to
 * @param formData Application form data
 */
export function saveJobApplication(jobId: string, formData: any): void {
  saveFormData(`${STORAGE_KEYS.JOB_APPLICATION}_${jobId}`, formData);
}

/**
 * Retrieve job application data for a specific job
 * @param jobId ID of the job
 * @returns The stored application data or null
 */
export function getJobApplication(jobId: string): any | null {
  return getFormData(`${STORAGE_KEYS.JOB_APPLICATION}_${jobId}`);
}

/**
 * Clear job application data for a specific job
 * @param jobId ID of the job
 */
export function clearJobApplication(jobId: string): void {
  clearFormData(`${STORAGE_KEYS.JOB_APPLICATION}_${jobId}`);
} 