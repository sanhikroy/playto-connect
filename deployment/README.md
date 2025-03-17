# Connect App - A2 Hosting Deployment

This directory contains the simplified files needed to deploy the Connect application to A2 Hosting. Follow these steps for successful deployment.

## Deployment Steps

### 1. Prepare Your A2 Hosting Account

1. Log in to your A2 Hosting cPanel account
2. Create a PostgreSQL database and user through cPanel
3. Make note of the database credentials

### 2. Update Environment Variables

1. Edit the `.env` file and update:
   - DATABASE_URL with your PostgreSQL database credentials
   - NEXTAUTH_URL with your actual domain
   - NEXTAUTH_SECRET with a secure random string (generate using `openssl rand -base64 32`)

### 3. Upload Files to A2 Hosting

1. Create a ZIP file containing all the files from this folder
2. Log in to cPanel and go to File Manager
3. Create a directory in the `public_html` folder (e.g., `connect`)
4. Upload and extract the ZIP file to this directory

### 4. Set Up Node.js Application

1. In cPanel, go to Tools > Setup Node.js App
2. Click CREATE APPLICATION
3. Set the following:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: connect (or your directory name)
   - Application URL: your domain name
   - Application startup file: server.js
4. Click CREATE
5. Click STOP APP if it's running
6. Click Run NPM Install (this may take a few minutes)
7. Once dependencies are installed, click START APP

### 5. Set Up Database

1. Run database migrations using Prisma:
   ```
   npx prisma generate
   npx prisma db push
   ```

### 6. Verify Deployment

1. Visit your domain to confirm the application is running
2. Test key functionality like authentication, database access, etc.

## Troubleshooting

If you encounter issues:
1. Check the Node.js application logs in cPanel
2. Verify that environment variables are set correctly
3. Ensure database credentials are correct
4. Check that all dependencies were installed correctly

For further assistance, contact A2 Hosting support or refer to their Next.js deployment documentation. 