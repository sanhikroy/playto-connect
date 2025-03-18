#!/usr/bin/env node

/**
 * This script prepares the database for first-time deployment to Vercel
 * Run this locally before deploying to Vercel
 * It requires DATABASE_URL and DIRECT_URL to be set in your environment
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute shell commands with output
function runCommand(command) {
  console.log(`\n> ${command}\n`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Check for required environment variables
function checkEnvironment() {
  const requiredVars = ['DATABASE_URL', 'DIRECT_URL'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set these variables in your .env file or environment before running this script.');
    console.error('You can get these values from the Vercel dashboard after creating a PostgreSQL database.');
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('🔍 Checking environment variables...');
  checkEnvironment();
  
  console.log('🚀 Preparing Vercel PostgreSQL database...');
  
  // Confirm with user
  rl.question('⚠️ This will reset your Vercel database. Continue? (y/N): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Operation cancelled.');
      rl.close();
      return;
    }
    
    // Step 1: Generate Prisma client
    if (!runCommand('npx prisma generate')) {
      rl.close();
      return;
    }
    
    // Step 2: Push schema to database (this is safer than migrate for first setup)
    if (!runCommand('npx prisma db push')) {
      rl.close();
      return;
    }
    
    console.log('✅ Database prepared successfully for Vercel deployment!');
    console.log('You can now deploy your application to Vercel.');
    
    rl.close();
  });
}

main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 