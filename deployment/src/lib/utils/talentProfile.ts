/**
 * Skill options for talent profiles
 */
export const skillOptions = [
  { value: 'adobe_premiere_pro', label: 'Adobe Premiere Pro' },
  { value: 'after_effects', label: 'After Effects' },
  { value: 'davinci_resolve', label: 'DaVinci Resolve' },
  { value: 'final_cut_pro', label: 'Final Cut Pro' },
  { value: 'motion_graphics', label: 'Motion Graphics' },
  { value: 'color_grading', label: 'Color Grading' },
  { value: 'sound_design', label: 'Sound Design' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'youtube_content_creation', label: 'YouTube Content Creation' },
  { value: 'camera_operation', label: 'Camera Operation' },
  { value: 'cinematography', label: 'Cinematography' },
  { value: 'directing', label: 'Directing' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'scriptwriting', label: 'Scriptwriting' },
  { value: 'vfx', label: 'VFX' },
  { value: '3d_animation', label: '3D Animation' },
  { value: '2d_animation', label: '2D Animation' },
];

/**
 * Experience level options for talent profiles
 */
export const experienceLevelOptions = [
  { value: 'less_than_1', label: 'Less than 1 year' },
  { value: '1_to_3', label: '1-3 years' },
  { value: '3_to_5', label: '3-5 years' },
  { value: '5_to_10', label: '5-10 years' },
  { value: 'more_than_10', label: 'More than 10 years' },
];

/**
 * Types of videos supported in portfolio
 */
export type VideoType = 'youtube' | 'instagram';

/**
 * Single video entry in portfolio
 */
export interface PortfolioVideo {
  id: string;
  url: string;
  type: VideoType;
  title?: string;
}

/**
 * Extract YouTube ID from a YouTube URL
 */
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Extract Instagram ID from an Instagram URL
 */
export function extractInstagramId(url: string): string | null {
  // Match Instagram post URLs like https://www.instagram.com/p/CpQBLfeA7VX/
  const regExp = /instagram.com\/p\/([^\/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Get YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get Instagram embed URL from post ID
 */
export function getInstagramEmbedUrl(postId: string): string {
  return `https://www.instagram.com/p/${postId}/embed`;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Detect video type from URL
 */
export function detectVideoType(url: string): VideoType | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('instagram.com')) {
    return 'instagram';
  }
  return null;
}

/**
 * Process video URL to extract ID and determine type
 */
export function processVideoUrl(url: string): { id: string; type: VideoType } | null {
  const type = detectVideoType(url);
  
  if (!type) return null;
  
  if (type === 'youtube') {
    const id = extractYouTubeId(url);
    if (!id) return null;
    return { id, type };
  } else if (type === 'instagram') {
    const id = extractInstagramId(url);
    if (!id) return null;
    return { id, type };
  }
  
  return null;
}

/**
 * Format a skill list for display
 */
export function formatSkillList(skills: string): string[] {
  try {
    // If it's already a JSON string, parse it
    if (typeof skills === 'string' && (skills.startsWith('[') || skills.startsWith('{'))) {
      return JSON.parse(skills);
    }
    // Otherwise split by commas
    return skills.split(',').map(s => s.trim());
  } catch (error) {
    // If parsing fails, just return as is
    return [skills];
  }
}

/**
 * Format experience level for display
 */
export function formatExperienceLevel(experienceKey: string): string {
  const option = experienceLevelOptions.find(opt => opt.value === experienceKey);
  return option ? option.label : experienceKey;
}

/**
 * Returns the URL for the default profile picture
 */
export function getDefaultProfilePicture(): string {
  return '/uploads/default-profile.svg';
} 