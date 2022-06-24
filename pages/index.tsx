import Head from 'next/head'
import Link from 'next/link'
import CategoryBadge from '../components/CategoryBadge'
import TrailersChart from '../components/TrailersChart'
import { Categories, getCategories } from '../lib/categories'
import { getTrailersSortedByComments, getTrailersSortedByLikes, getTrailersSortedByViews, Trailers } from '../lib/trailers'
import { mapCategoryToColor } from '../lib/utils'

// tailwind components: https://flowbite.com/docs/

interface Props {
  categories: Categories
  top10: {
    trailersByViews: Trailers,
    trailersByLikes: Trailers,
    trailersByComments: Trailers
  }
}

const Home = ({ categories, top10 }: Props) => {
  return (
    // <div className={styles.container}>
    // <div className='bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'>
    <div className='md:container md:mx-auto'>
      <Head>
        <title>Game Trailer Stats</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className={styles.main}> */}
      <main className='mx-auto text-center'>
        {/* <h1 className={styles.title}> */}
        <h1 className='text-6xl'>
          Game Trailer Stats
        </h1>

        <div className='p-4'>
          <p>Compare upcoming games based on views, likes, and comments of their announcement trailers on YouTube.</p>
          <div className='flex flex-row justify-center'>
            <Link href='/game-list'><a className='focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900'>Game List</a></Link>
            <Link href='/console-war'><a className='focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900'>Console War</a></Link>
          </div>
        </div>

        <div className='p-4 pt-0 w-100'>
          <h2 className='text-2xl'>Categories</h2>
          <div className='flex flex-wrap justify-center'>
            {categories.map((category) => {
              const color = mapCategoryToColor(category.name)
              return (<CategoryBadge key={`category-${category.id}`} color={color} href={`/category/${category.slug}`}>{category.name}</CategoryBadge>)
            })}
          </div>
        </div>

        {/* <nav>
          <ul>
            <li><Link href='/game-list'>Game List</Link></li>
            <li><Link href='/console-war'>Console War</Link></li>
            {categories.map((category) => (<li key={`nav-li-${category.id}`}><Link href={`/category/${category.slug}`}>{category.name}</Link></li>))}
          </ul>
        </nav> */}

        <div className='grid grid-cols-1 lg:grid-cols-3 justify-center'>
          {/* <div className='flex flex-col lg:flex-row justify-center'> */}
          <div className='w-100'>
            <h2 className='text-2xl'>Top10 Views</h2>
            <TrailersChart accessorField='viewCount' trailers={top10?.trailersByViews || []} />
          </div>
          <div className='w-100'>
            <h2 className='text-2xl'>Top10 Likes</h2>
            <TrailersChart accessorField='likeCount' trailers={top10?.trailersByLikes || []} />
          </div>
          <div className='w-100'>
            <h2 className='text-2xl'>Top10 Comments</h2>
            <TrailersChart accessorField='commentCount' trailers={top10?.trailersByComments || []} />
          </div>
        </div>
      </main>

      {/* <footer className={styles.footer}> */}
      <footer className='mx-auto'>
        <span className='block text-center'>&copy; Made by <a
          href="https://github.com/DarkC35"
          target="_blank"
          rel="noopener noreferrer"
        >DarkC</a> with <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
            Next.js
          </a></span>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const categories = await getCategories()
  const trailersByViews = await getTrailersSortedByViews(10)
  const trailersByLikes = await getTrailersSortedByLikes(10)
  const trailersByComments = await getTrailersSortedByComments(10)
  return { props: { categories, top10: { trailersByViews, trailersByLikes, trailersByComments } } }
}

export default Home
