// import google from '@googleapis/youtube'
// import data from '../data/trailers.json'

// interface Trailer {
//     id?: string
//     game_name: string
//     youtube_id: string
//     categories: string[]
//     game_url?: string
//     release_date?: Date
// }
const path = require('path')
const fs = require('fs')
const google = require('@googleapis/youtube')
const data = require('../data/trailers.json')
const { PrismaClient } = require('@prisma/client')
const slugify = require('slugify')
require('dotenv').config()
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers')

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
})

// const trailers: Trailer[] = data
const trailers = data

const prisma = new PrismaClient()

async function main(crawlOnly) {
    const trailerById = trailers.reduce((prev, curr, currentIndex) => {
        prev[curr.youtubeId] = { ...curr, arrayIndex: currentIndex }
        return prev
    }, {})
    const ids = trailers.map(trailer => trailer.youtubeId).join(',')

    console.log("fetching youtube stats...")
    const videos = await youtube.videos.list({
        id: ids,
        part: 'id,snippet,statistics'
    })

    console.log("processing youtube stats...")
    const trailerDtos = videos.data.items.map(item => ({
        id: trailerById[item.id].id,
        gameTitle: trailerById[item.id].gameTitle,
        gameUrl: trailerById[item.id].gameUrl,
        releaseDate: trailerById[item.id].releaseDate ? new Date(trailerById[item.id].releaseDate) : null,
        categories: trailerById[item.id].categories,
        youtubeId: trailerById[item.id].youtubeId,
        trailerTitle: item.snippet.title,
        trailerUrl: `https://www.youtube.com/watch?v=${item.id}`,
        trailerPublishedAt: item.snippet.publishedAt,
        trailerChannelTitle: item.snippet.channelTitle,
        statistics: {
            viewCount: parseInt(item.statistics.viewCount),
            likeCount: parseInt(item.statistics.likeCount),
            commentCount: parseInt(item.statistics.commentCount)
        }
    }))
    // TODO: consider pagination

    if (trailerDtos.length !== trailers.length) {
        console.log("warning, number of returned videos don't match number of trailers, please check for wrong IDs")
    }

    if (crawlOnly) {
        console.log("crawl only mode, printing youtube stats...")
        console.log(trailerDtos)
    } else {
        const trailersToCreate = trailerDtos.filter(trailerDto => !(trailerDto.id))
        const trailersToUpdate = trailerDtos.filter(trailerDto => trailerDto.id)

        console.log("creating new trailer entries...")
        const createdTrailers = await Promise.all(trailersToCreate.map(async (trailerToCreate) => {
            const { statistics, categories, ...trailer } = trailerToCreate
            return await prisma.trailer.create({
                data: {
                    ...trailer,
                    categories: {
                        connectOrCreate: categories.map(category => ({ where: { name: category }, create: { name: category, slug: slugify(category) } }))
                    },
                    statistics: {
                        createMany: { data: statistics }
                    }
                }
            })
        }))
        const createdTrailersCount = (createdTrailers || []).length
        console.log(`${createdTrailersCount} entries created.`)

        if (createdTrailersCount > 0) {
            console.log("updating trailer data...")
            createdTrailers.forEach(trailer => {
                const arrayIndex = trailerById[trailer.youtubeId].arrayIndex
                trailers[arrayIndex] = { id: trailer.id, ...trailers[arrayIndex] }
            })
            fs.writeFileSync(path.join(process.cwd(), 'data', 'trailers.json'), JSON.stringify(trailers, undefined, 4))
        }

        console.log("updating trailer entries...")
        const updatedTrailers = await Promise.all(trailersToUpdate.map(async (trailerToUpdate) => {
            const { id, statistics, categories, ...trailer } = trailerToUpdate
            return await prisma.trailer.update({
                data: {
                    ...trailer,
                    categories: {
                        connectOrCreate: categories.map(category => ({ where: { name: category }, create: { name: category, slug: slugify(category) } }))
                    },
                    statistics: {
                        upsert: { create: statistics, update: statistics, where: { date_trailerId: { trailerId: id, date: new Date() } } }
                    }
                },
                where: {
                    id: id
                }
            })
        }))
        const updatedTrailersCount = (updatedTrailers || []).length
        console.log(`${updatedTrailersCount} entries updated.`)
    }
}

yargs(hideBin(process.argv))
    .command(
        '*',
        '',
        (yargs) => yargs.option('crawlOnly', { type: 'boolean', description: 'Only crawls data from YouTube Data API and prints result on the console' }),
        async (argv) =>
            await main(argv.crawlOnly).catch((e) => {
                throw e
            }).finally(async () => {
                await prisma.$disconnect()
            })
    )
    .help()
    .argv
