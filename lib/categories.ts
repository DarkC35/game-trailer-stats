import { Prisma, Category as PrismaCategory } from '@prisma/client'
import { prisma } from './db'

export type Categories = Prisma.PromiseReturnType<typeof getCategories>
export type Category = PrismaCategory

export async function getCategories() {
    const categories = await prisma.category.findMany()

    return categories
}

export async function getCategoryBySlug(slug: string) {
    const category = await prisma.category.findFirst({
        where: {
            slug
        }
    })
    return category
}