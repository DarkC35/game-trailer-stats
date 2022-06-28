import Head from "next/head"
import Link from "next/link"
import TrailersChart from "../components/TrailersChart"
import { getTrailersByCategorySlugs, Trailers } from "../lib/trailers"

interface Props {
    trailers: Trailers
}

const slugs = [
    "PlayStation-Exclusive",
    "Xbox-Exclusive",
    "Nintendo-Exclusive"
]

const ConsoleWarPage = ({ trailers }: Props) => {
    return (
        <div className='container mx-auto'>
            <Head>
                <title>Console War</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className='text-4xl'>Console War</h1>
            <Link href={'/'}>Back to Index</Link>
            <p>Number of entries: {trailers?.length}</p>
            <TrailersChart
                trailers={trailers}
                accessorField="viewCount"
                colorScaleRange={["#377eb8", "#4daf4a", "#e41a1c"]}
                colorScaleDomain={slugs}
                colorScaleMapperFunc={(trailer) => trailer?.categories.find(category => category.name.endsWith("Exclusive"))?.slug}
            />
            <div className='grid grid-cols-1 md:grid-cols-3 justify-center'>
                {/* <div className='p-6 max-w-sm bg-white rounded-lg border border-blue-200 shadow-md dark:bg-gray-800 dark:border-blue-700'> */}
                <div className='p-6 m-2 max-w-sm bg-white rounded-lg border border-blue-200 shadow-md'>
                    <h2 className='text-2xl text-blue-800'><Link href='/category/PlayStation-Exclusive'><a>PlayStation</a></Link></h2>
                    <ul>
                        {trailers.filter(trailer => trailer.categories.find(category => category.name === 'PlayStation Exclusive')).map(trailer => (
                            <li key={`playstation-exclusive-${trailer.id}`}>
                            <Link href={`/trailer/${trailer.id}`}><a>{trailer.gameTitle} ({trailer.statistics[0].viewCount})</a></Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='p-6 m-2 max-w-sm bg-white rounded-lg border border-green-200 shadow-md'>
                    <h2 className='text-2xl text-green-800'><Link href='/category/Xbox-Exclusive'><a>Xbox</a></Link></h2>
                    <ul>
                        {trailers.filter(trailer => trailer.categories.find(category => category.name === 'Xbox Exclusive')).map(trailer =>
                        (<li key={`xbox-exclusive-${trailer.id}`}>
                            <Link href={`/trailer/${trailer.id}`}><a>{trailer.gameTitle} ({trailer.statistics[0].viewCount})</a></Link>
                        </li>)
                        )}
                    </ul>
                </div>
                <div className='p-6 m-2 max-w-sm bg-white rounded-lg border border-red-200 shadow-md'>
                    <h2 className='text-2xl text-red-800'><Link href='/category/Nintendo-Exclusive'><a>Nintendo</a></Link></h2>
                    <ul>
                        {trailers.filter(trailer => trailer.categories.find(category => category.name === 'Nintendo Exclusive')).map(trailer =>
                        (<li key={`nintendo-exclusive-${trailer.id}`}>
                            <Link href={`/trailer/${trailer.id}`}><a>{trailer.gameTitle} ({trailer.statistics[0].viewCount})</a></Link>
                        </li>)
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const trailers = (await getTrailersByCategorySlugs(slugs)).sort((a, b) => b.statistics[0].viewCount - a.statistics[0].viewCount)
    return { props: { trailers } }
}

export default ConsoleWarPage