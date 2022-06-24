import { Prisma } from '@prisma/client'
import { prisma } from './db'

export type Trailers = Prisma.PromiseReturnType<typeof getTrailersByCategorySlug>
export type Trailer = Prisma.PromiseReturnType<typeof getTrailerById>

// function serializableTrailer(trailer: any) {
//     return {
//         ...trailer,
//         createdAt: trailer.createdAt.toISOString(),
//         updatedAt: trailer.updatedAt.toISOString(),
//         releaseDate: trailer.releaseDate?.toISOString(),
//         trailerPublishedAt: trailer.trailerPublishedAt.toISOString()
//     }
// }

const includeCategoriesAndSortedStatistics = Prisma.validator<Prisma.TrailerInclude>()({
    categories: true,
    statistics: {
        orderBy: {
            date: 'desc'
        }
    }
})

export async function getTrailers() {
    const trailers = await prisma.trailer.findMany({
        include: includeCategoriesAndSortedStatistics
    })
    return trailers
}

export async function getTrailersByCategorySlug(categorySlug: string) {
    const trailers = await prisma.trailer.findMany({
        where: {
            categories: { some: { slug: categorySlug } }
        },
        include: includeCategoriesAndSortedStatistics
    })
    return trailers
}

export async function getTrailersByCategorySlugs(categorySlugs: string[]) {
    const trailers = await prisma.trailer.findMany({
        where: {
            categories: { some: { slug: { in: categorySlugs } } }
        },
        include: includeCategoriesAndSortedStatistics
    })
    return trailers
}

export async function getTrailerById(id: string) {
    const trailer = await prisma.trailer.findUnique({
        where: {
            id
        },
        include: includeCategoriesAndSortedStatistics
    })
    return trailer
}

export async function getTrailersByIds(ids: string[]) {
    const trailers = await prisma.trailer.findMany({
        where: {
            id: {
                in: ids
            }
        },
        include: includeCategoriesAndSortedStatistics
    })
    return trailers
}

export async function getTrailersSortedByViews(top: number) {
    const statistics = await prisma.statistic.findMany({
        where: {
            date: new Date()
        },
        orderBy: {
            viewCount: 'desc'
        },
        take: top
    })
    const trailers = await getTrailersByIds(statistics.map(statistic => statistic.trailerId))
    return trailers
}

export async function getTrailersSortedByLikes(top: number) {
    const statistics = await prisma.statistic.findMany({
        where: {
            date: new Date()
        },
        orderBy: {
            likeCount: 'desc'
        },
        take: top
    })
    const trailers = await getTrailersByIds(statistics.map(statistic => statistic.trailerId))
    return trailers
}

export async function getTrailersSortedByComments(top: number) {
    const statistics = await prisma.statistic.findMany({
        where: {
            date: new Date()
        },
        orderBy: {
            commentCount: 'desc'
        },
        take: top
    })
    const trailers = await getTrailersByIds(statistics.map(statistic => statistic.trailerId))
    return trailers
}