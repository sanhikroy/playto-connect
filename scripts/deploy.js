#!/usr/bin/env node

/**
 * This script is used during the build phase on Vercel
 * It handles database migrations safely
 */

const { execSync } = require('child_process');
const { promises: fs } = require('fs');

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';
const isPrismaEngine = ['postgresql', 'mysql', 'mongodb'].includes(process.env.DATABASE_PROVIDER);

async function main() {
  console.log('🚀 Starting deployment setup...');
  
  try {
    // Step 1: Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Step 2: Run migrations if in production and using a proper database engine
    if (isProduction && isPrismaEngine) {
      console.log('🔄 Running database migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } else {
      console.log('⏭️ Skipping migrations (not in production or using SQLite)');
    }
    
    // Step 3: Additional deployment tasks can be added here
    
    console.log('✅ Deployment setup completed successfully!');
  } catch (error) {
    console.error('❌ Deployment setup failed:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 