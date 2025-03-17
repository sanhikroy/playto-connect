#!/usr/bin/env node

/**
 * Database backup script for production
 * This script can be scheduled to run regularly using cron or similar
 * 
 * Usage: 
 * - Manual: node scripts/backup-database.js
 * - Scheduled: Set up in CI/CD pipeline or cron
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const config = {
  // Backup settings
  backupDir: process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups'),
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  
  // Database settings (for PostgreSQL)
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '5432',
  dbName: process.env.DB_NAME || 'connect',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD,
  
  // S3 settings for remote backup
  useS3Backup: process.env.USE_S3_BACKUP === 'true',
  s3Bucket: process.env.S3_BACKUP_BUCKET,
  s3Region: process.env.S3_BACKUP_REGION || 'us-east-1',
  s3Path: process.env.S3_BACKUP_PATH || 'database-backups',
  
  // Notification settings
  notifyOnFailure: process.env.NOTIFY_ON_FAILURE === 'true',
  notificationEmail: process.env.NOTIFICATION_EMAIL,
};

// Create backup filename with timestamp
const getBackupFilename = () => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  return `${config.dbName}_backup_${timestamp}.sql`;
};

// Ensure backup directory exists
const ensureBackupDir = () => {
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
    console.log(`Created backup directory: ${config.backupDir}`);
  }
};

// Backup PostgreSQL database
const backupPostgres = (filename) => {
  const backupPath = path.join(config.backupDir, filename);
  const pgDumpCommand = [
    'pg_dump',
    `-h ${config.dbHost}`,
    `-p ${config.dbPort}`,
    `-U ${config.dbUser}`,
    `-d ${config.dbName}`,
    '-F c', // Custom format (compressed)
    `-f ${backupPath}`,
  ].join(' ');
  
  console.log(`Backing up PostgreSQL database to ${backupPath}`);
  
  try {
    if (config.dbPassword) {
      // Set PGPASSWORD environment variable for authentication
      process.env.PGPASSWORD = config.dbPassword;
    }
    
    execSync(pgDumpCommand, { stdio: 'inherit' });
    console.log('Database backup completed successfully');
    return backupPath;
  } catch (error) {
    console.error('Database backup failed:', error.message);
    throw error;
  } finally {
    // Clear password from environment
    if (config.dbPassword) {
      delete process.env.PGPASSWORD;
    }
  }
};

// Upload backup to S3
const uploadToS3 = (backupPath) => {
  if (!config.useS3Backup) return;
  
  if (!config.s3Bucket) {
    console.warn('S3 backup enabled but no bucket specified. Skipping S3 upload.');
    return;
  }
  
  const filename = path.basename(backupPath);
  const s3Key = `${config.s3Path}/${filename}`;
  const s3Command = [
    'aws s3 cp',
    backupPath,
    `s3://${config.s3Bucket}/${s3Key}`,
    `--region ${config.s3Region}`,
  ].join(' ');
  
  console.log(`Uploading backup to S3: s3://${config.s3Bucket}/${s3Key}`);
  
  try {
    execSync(s3Command, { stdio: 'inherit' });
    console.log('Backup uploaded to S3 successfully');
  } catch (error) {
    console.error('Failed to upload backup to S3:', error.message);
    throw error;
  }
};

// Clean up old backups
const cleanupOldBackups = () => {
  const now = Date.now();
  const retentionMs = config.retentionDays * 24 * 60 * 60 * 1000;
  
  console.log(`Cleaning up backups older than ${config.retentionDays} days`);
  
  fs.readdirSync(config.backupDir).forEach((file) => {
    const filePath = path.join(config.backupDir, file);
    const stats = fs.statSync(filePath);
    
    if (now - stats.mtime.getTime() > retentionMs) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old backup: ${file}`);
    }
  });
};

// Send notification on failure
const sendFailureNotification = (error) => {
  if (!config.notifyOnFailure || !config.notificationEmail) return;
  
  console.log(`Sending failure notification to ${config.notificationEmail}`);
  
  // In a real implementation, you would integrate with an email service
  // For this example, we'll just log it
  console.log('Notification would be sent with:', {
    to: config.notificationEmail,
    subject: 'Database Backup Failed',
    body: `Database backup failed with error: ${error.message}`,
  });
};

// Main backup function
const runBackup = async () => {
  try {
    ensureBackupDir();
    
    const filename = getBackupFilename();
    const backupPath = backupPostgres(filename);
    
    if (config.useS3Backup) {
      uploadToS3(backupPath);
    }
    
    cleanupOldBackups();
    
    console.log('Backup process completed successfully');
  } catch (error) {
    console.error('Backup process failed:', error.message);
    
    if (config.notifyOnFailure) {
      sendFailureNotification(error);
    }
    
    process.exit(1);
  }
};

// Run the backup
runBackup(); 