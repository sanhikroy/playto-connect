# Deploying to Vercel

This guide provides step-by-step instructions for deploying your Connect application to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- A [GitHub](https://github.com) account with your repository pushed
- Your code ready for deployment (all local changes committed and pushed)

## Step 1: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Select the "Connect" repository from the list

## Step 2: Configure Project Settings

1. **Choose Project Name:**
   - Enter a name for your project or use the default

2. **Choose Framework Preset:**
   - Vercel should automatically detect Next.js

3. **Configure Build Settings:**
   - Build Command: `npm run vercel-build` (already set in vercel.json)
   - Output Directory: `.next` (already set in vercel.json)
   - Install Command: `npm ci` (already set in vercel.json)

## Step 3: Set Up PostgreSQL Database

1. **Create a New Vercel PostgreSQL Database:**
   - Go to the [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to "Storage" > "Create" > "PostgreSQL Database"
   - Follow the prompts to create a new database
   - Connect the database to your project

2. **Get Database Connection Details:**
   - After creating the database, Vercel will provide you with connection details
   - These will be automatically added as environment variables to your project

## Step 4: Configure Environment Variables

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" tab
3. Add the following environment variables:

   ```
   # Already provided by Vercel PostgreSQL integration:
   # DATABASE_URL
   # DIRECT_URL
   
   # Database configuration
   DATABASE_PROVIDER=postgresql
   
   # Authentication
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXTAUTH_SECRET=<generate-a-secure-random-value>
   
   # CSRF Protection
   CSRF_SECRET=<generate-a-secure-random-value>
   
   # Other settings
   NEXT_TELEMETRY_DISABLED=1
   ```

4. To generate secure random values for secrets:
   ```bash
   node -e "console.log(crypto.randomBytes(32).toString('hex'))"
   ```

## Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once deployment is complete, you can view your live application at the provided URL

## Step 6: Verify Deployment

1. Check your live application
2. Test authentication flows
3. Verify database connections
4. Test all main functionalities

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Check that `DATABASE_PROVIDER` is set to "postgresql"
2. Verify that both `DATABASE_URL` and `DIRECT_URL` are set correctly
3. Check the build logs for any Prisma-related errors

### Build Failures

If your build fails:

1. Review the build logs in the Vercel dashboard
2. Check that all environment variables are set correctly
3. Make sure your code is properly committed and pushed to GitHub

### Runtime Errors

If your app deploys but has runtime errors:

1. Check browser console for errors
2. Review server logs in the Vercel dashboard
3. Ensure all required environment variables are set

## Production Monitoring

Set up monitoring for your production app:

1. Use [Vercel Analytics](https://vercel.com/analytics) for performance monitoring
2. Set up error tracking with [Sentry](https://sentry.io) or similar services
3. Configure [Vercel Logs](https://vercel.com/docs/logs) for serverless function logging

## CI/CD Integration

Your GitHub Actions workflow (`ci-cd.yml`) has already been configured to work with Vercel deployments. 