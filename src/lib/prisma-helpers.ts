import { PrismaClient } from '@prisma/client'
import prisma from '@/lib/prisma'

/**
 * Type definitions for Prisma models that may not be recognized by TypeScript
 * due to generation timing or other issues
 */
export interface PasswordResetToken {
  id: string
  token: string
  email: string
  expires: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Extended PrismaClient type that includes the PasswordResetToken model
 */
export interface ExtendedPrismaClient extends PrismaClient {
  passwordResetToken: {
    findUnique: (args: { where: { token: string } | { id: string } }) => Promise<PasswordResetToken | null>
    create: (args: { data: Omit<PasswordResetToken, 'id' | 'createdAt' | 'updatedAt'> }) => Promise<PasswordResetToken>
    delete: (args: { where: { token: string } | { id: string } }) => Promise<PasswordResetToken>
    deleteMany: (args: { where: { email: string } }) => Promise<{ count: number }>
  }
}

/**
 * Extended Prisma client with type casting to access the PasswordResetToken model
 */
export const extendedPrisma = prisma as unknown as ExtendedPrismaClient

export default extendedPrisma 