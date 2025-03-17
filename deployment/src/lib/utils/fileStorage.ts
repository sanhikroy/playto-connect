import { mkdir, stat } from 'fs/promises';
import { join } from 'path';

/**
 * Ensures that a directory exists, creating it if necessary
 */
export async function ensureDirectoryExists(directory: string): Promise<void> {
  try {
    // Check if directory exists
    await stat(directory);
  } catch (error) {
    // Directory doesn't exist, create it
    await mkdir(directory, { recursive: true });
  }
}

/**
 * Gets the full path to the uploads directory
 */
export function getUploadsDirectory(): string {
  return join(process.cwd(), 'public', 'uploads');
} 