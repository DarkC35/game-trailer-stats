import Head from "next/head"
import Link from "next/link"
import CategoryBadge from "../components/CategoryBadge"
import { Trailers, getTrailers } from "../lib/trailers"
import { mapCategoryToColor } from "../lib/utils"

interface Props {
    trailers: Trailers
}

const GameListPage = ({ trailers }: Props) => {
    return (
        <div className='container mx-auto'>
            <Head>
                <title>Game List</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className='text-4xl'>Game List</h1>
            <Link href={'/'}>Back to Index</Link>
            {trailers.sort((a, b) => a.gameTitle.localeCompare(b.gameTitle)).map(trailer => (
                <div key={`game-list-item-${trailer.id}`}>
                    <h2 className='text-2xl'><Link href={`/trailer/{trailer.id}`}>{trailer.gameTitle}</Link></h2>
                    {/* <p>Categories: {trailer.categories?.map(category => category.name).join(';')}</p> */}
                    <div className='flex flex-wrap'>
                        {trailer.categories?.map(category => {
                            const color = mapCategoryToColor(category.name)
                            // className='hover:bg-blue-200 dark:hover:bg-blue-300 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800'
                            return (
                                <CategoryBadge key={`game-list-item-${trailer.id}-category-${category.slug}`} href={`/category/${category.slug}`} color={color}>{category.name}</CategoryBadge>
                            )
                        })}
                    </div>
                </div>
            ))
            }
        </div >
    )
}

export async function getStaticProps() {
    const trailers = await getTrailers()
    return { props: { trailers } }
}

export default GameListPage