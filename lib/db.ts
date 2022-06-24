// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem
import { PrismaClient } from '@prisma/client'

declare global {
    // allow global `var` declarations
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

export const prisma =
    global.prisma || function () {
        const prismaClient = new PrismaClient({
            // log: [{ emit: 'event', level: 'query' }],
            // log: ['query']
        })
        // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging#event-based-logging
        // prismaClient.$on('query', (e) => {
        //     console.log('Query: ' + e.query)
        //     console.log('Params: ' + e.params)
        //     console.log('Duration: ' + e.duration + 'ms')
        // })
        return prismaClient
    }()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
