/**
 * Prisma Client Singleton
 *
 * This file ensures we only have one Prisma Client instance
 * across the entire application, especially important in development
 * where hot reloading can create multiple instances.
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Graceful shutdown
if (process.env.NODE_ENV !== 'production') {
    process.on('SIGTERM', async () => {
        await prisma.$disconnect()
    })
}

export default prisma
