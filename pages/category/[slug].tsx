import Head from "next/head";
import Link from "next/link";
import TrailersChart from "../../components/TrailersChart";
import { Category, getCategories, getCategoryBySlug } from "../../lib/categories";
import { getTrailersByCategorySlug, Trailers } from "../../lib/trailers";

interface Props {
    trailers: Trailers,
    category: Category
}

interface Context {
    params: {
        slug: string
    }
}

const CategoryPage = ({ trailers, category }: Props) => {
    return (
        <div className='container mx-auto'>
            <Head>
                <title>{`${category?.name} Trailers`}</title>
            </Head>
            <h1 className='text-4xl'>{category?.name}</h1>
            <Link href={'/'}>Back to Index</Link>
            <p>Number of entries: {trailers?.length}</p>
            <TrailersChart accessorField="viewCount" trailers={trailers} />
            {/* <ul>
                {trailers.map(trailer =>
                    <li key={trailer.id}>
                        <Link href={`/trailer/${trailer.id}`}><a>{trailer.gameTitle} ({trailer.releaseDate?.toDateString() || 'TBA'})</a></Link>
                        <ul>
                            {trailer.statistics?.map(statistic => <li key={`${trailer.id}-${statistic.date}`}>Date: {statistic.date.toDateString()} Views: {statistic.viewCount} Likes: {statistic.likeCount} Comments: {statistic.commentCount}</li>)}
                        </ul>
                    </li>)}
            </ul> */}
        </div>
    )
}

export async function getStaticPaths() {
    const categories = await getCategories()
    const paths = categories.map((category) => ({ params: { slug: category.slug }, }))
    return {
        paths,
        fallback: false
    };
}

export async function getStaticProps(context: Context) {
    const slug = context.params.slug
    const category = await getCategoryBySlug(slug)
    const trailers = await getTrailersByCategorySlug(slug)
    return { props: { trailers, category } }
}

export default CategoryPage
