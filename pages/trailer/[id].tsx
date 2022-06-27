import Head from "next/head"
import Link from "next/link"
import CategoryBadge from "../../components/CategoryBadge"
import TrailersChart from "../../components/TrailersChart"
import { getTrailerById, getTrailers, Trailer } from "../../lib/trailers"
import { mapCategoryToColor } from "../../lib/utils"

interface Props {
    trailer: Trailer
}

interface Context {
    params: {
        id: string
    }
}

const TrailerPage = ({ trailer }: Props) => {

    return (
        <div className='container mx-auto'>
            <Head>
                <title>{trailer?.gameTitle}</title>
            </Head>
            <h1 className='text-4xl'>{trailer?.gameTitle}</h1>
            <Link href={'/'}>Back to Index</Link>
            <h2 className='text-2xl'>Trailer Data</h2>
            <p>Title: {trailer?.trailerTitle}</p>
            <p>Channel: {trailer?.trailerChannelTitle}</p>
            <p>Published at: {trailer?.trailerPublishedAt.toISOString()}</p>
            <p><a href={trailer?.trailerUrl}>Watch on YouTube</a></p>
            <p>Trailer added at: {trailer?.createdAt.toISOString()}</p>
            <p>Last updated at: {trailer?.updatedAt.toISOString()}</p>
            <p>Game release date (expected): {trailer?.releaseDate?.toISOString() || 'TBA'}</p>
            <p><Link href={trailer?.gameUrl || '.'}>Visit game page</Link></p>
            <h2 className='text-2xl'>Categories</h2>
            {/* <ul>
                {trailer?.categories.map(category =>
                    <li key={`category-li-${category.slug}`}>
                        <Link href={`/category/${category.slug}`}>{category.name}</Link>
                    </li>
                )}
            </ul> */}
            <div className='flex flex-wrap'>
                {trailer?.categories.map(category =>
                    <CategoryBadge key={`category-list-${category.slug}`} href={`/category/${category.slug}`} color={mapCategoryToColor(category.name)}>
                        {category.name}
                    </CategoryBadge>
                )}
            </div>
            <h2 className='text-2xl'>Views</h2>
            <TrailersChart trailers={trailer ? [trailer] : []} accessorField="viewCount" xLabel="Date" yLabel="Views" isSingleTrailer />
            <h2 className='text-2xl'>Likes</h2>
            <TrailersChart trailers={trailer ? [trailer] : []} accessorField="likeCount" xLabel="Date" yLabel="Likes" isSingleTrailer />
            <h2 className='text-2xl'>Comments</h2>
            <TrailersChart trailers={trailer ? [trailer] : []} accessorField="commentCount" xLabel="Date" yLabel="Comments" isSingleTrailer />
            {/* <h2 className='text-2xl'>Statistics</h2>
            <ul>
                {trailer?.statistics?.map(statistic => <li key={`${statistic.date}`}>Date: {statistic.date.toDateString()} Views: {statistic.viewCount} Likes: {statistic.likeCount} Comments: {statistic.commentCount}</li>)}
            </ul> */}
        </div >
    )
}

export async function getStaticPaths() {
    const categories = await getTrailers()
    const paths = categories.map((trailer) => ({ params: { id: trailer.id }, }))
    return {
        paths,
        fallback: true
    };
}

export async function getStaticProps(context: Context) {
    const { id } = context.params
    const trailer = await getTrailerById(id)
    return { props: { trailer } }
}

export default TrailerPage