# Vercel Deployment Checklist

This document provides a step-by-step guide for deploying the Connect application to Vercel.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [GitHub account](https://github.com/signup) (for repository integration)
- Access to the Connect GitHub repository

## Step 1: Set Up Vercel PostgreSQL Database

1. Log in to your Vercel account
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
3. Click on "Storage" from the left menu
4. Select "PostgreSQL" and click "Create"
5. Follow the setup wizard:
   - Name your database (e.g., `connect-db`)
   - Select a region closest to your users
   - Configure the storage capacity as needed
6. Once created, note the following connection strings:
   - `DATABASE_URL`: PostgreSQL connection string
   - `DIRECT_URL`: Direct PostgreSQL connection string

## Step 2: Configure Vercel Project

1. From the Vercel Dashboard, click "Add New" > "Project"
2. Import the Connect repository from GitHub
3. Configure the project with the following settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (if your code is in the root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

## Step 3: Configure Environment Variables

Add the following environment variables in the Vercel project settings:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_PROVIDER` | `postgresql` | Specify the database provider |
| `DATABASE_URL` | `postgres://...` | PostgreSQL connection string (from Step 1) |
| `DIRECT_URL` | `postgres://...` | Direct PostgreSQL connection string (from Step 1) |
| `NEXTAUTH_SECRET` | `your-secret-here` | A secure random string for NextAuth.js |
| `NEXTAUTH_URL` | `https://your-project-url.vercel.app` | Your Vercel deployment URL |
| `UPLOAD_DIR` | `/tmp/uploads` | Directory for temporary file uploads |
| `MAX_FILE_SIZE` | `5242880` | Maximum file size (5MB) in bytes |

## Step 4: Set Up GitHub Actions Secrets

Add the following secrets to your GitHub repository:

| Name | Value | Description |
|------|-------|-------------|
| `VERCEL_TOKEN` | `your-vercel-token` | Vercel API token (create in Vercel account settings) |
| `VERCEL_ORG_ID` | `your-org-id` | Found in Vercel project settings |
| `VERCEL_PROJECT_ID` | `your-project-id` | Found in Vercel project settings |

## Step 5: Deploy

1. Either push changes to your GitHub repository (if CI/CD is set up)
2. Or click "Deploy" in the Vercel project dashboard

## Step 6: Run Database Migrations

After deployment:

1. Connect to your Vercel deployment using the Vercel CLI:
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   ```

2. Run database migrations:
   ```bash
   vercel env pull .env.production.local
   NODE_ENV=production npx prisma migrate deploy
   ```

## Step 7: Verify Deployment

- Visit your deployed application
- Test user registration and login
- Verify that database operations work correctly
- Check that file uploads are functioning

## Step 8: Set Up Monitoring

- Set up [Vercel Analytics](https://vercel.com/analytics) for Web Vitals monitoring
- Consider integrating an error tracking tool like [Sentry](https://sentry.io)

## Troubleshooting

- **Database Connection Issues**: Verify that the connection strings are correctly formatted
- **Build Failures**: Check the build logs for errors
- **Migration Errors**: Run migrations manually using the Vercel CLI
- **Environment Variable Problems**: Redeploy after updating environment variables

For additional support, refer to the [Vercel Documentation](https://vercel.com/docs) or [Next.js Documentation](https://nextjs.org/docs/deployment). 