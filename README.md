# Connect - Talent Marketplace Platform

A platform connecting video professionals with employers seeking their skills.

## Getting Started

First, set up your environment variables:

```bash
# Copy the example environment variables
cp .env.example .env.local

# Update the variables with your own values
```

Then, run the development server:

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

This project requires the following environment variables:

```
# Database
DATABASE_PROVIDER="sqlite" # For local development
DATABASE_URL="file:./dev.db" # For local development

# Authentication
NEXTAUTH_URL="http://localhost:3000" # For local development
NEXTAUTH_SECRET="your-secret-key"

# CSRF Protection
CSRF_SECRET="your-csrf-secret"
```

## Database

For local development, this project uses SQLite. For production, it uses PostgreSQL.

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## Deploy on Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com/signup)
2. Install Vercel CLI (optional): `npm i -g vercel`

### Step 1: Configure Vercel Project

1. Connect your GitHub repository to Vercel
2. Set up project settings:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm ci`

### Step 2: Set Up PostgreSQL Database

1. In Vercel dashboard, go to the Storage section
2. Create a new PostgreSQL database
3. Connect it to your project
4. Copy the connection strings to your environment variables

### Step 3: Configure Environment Variables

Add the following environment variables in Vercel:

```
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://username:password@hostname:port/database
DIRECT_URL=postgresql://username:password@hostname:port/database
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=[generate a secure random string]
CSRF_SECRET=[generate a secure random string]
```

### Step 4: Deploy

1. Push your changes to GitHub
2. Vercel will automatically deploy your application
3. For manual deployment: `vercel --prod`

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Testing

```bash
# Run Jest tests
npm test

# Run Cypress tests
npm run test:e2e
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Vercel Documentation](https://vercel.com/docs)
