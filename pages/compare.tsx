import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import TrailersChart from "../components/TrailersChart"
import { getTrailers, Trailers, Trailer } from "../lib/trailers"

interface Props {
    trailers: Trailers
}

const ComparePage = ({ trailers }: Props) => {
    const [selectedTrailerIdexes, setSelectedTrailerIndexes] = useState<number[]>([])

    const selectedTrailers = selectedTrailerIdexes.map(index => trailers[index])

    return (
        <div className='container mx-auto'>
            <Head>
                <title>Compare</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className='text-4xl'>Compare</h1>
            <Link href={'/'}>Back to Index</Link>
            <p>Number of trailers: {trailers?.length}</p>
            <select
                id="underline_select" className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                onChange={event => {
                    console.log("select", event, event.target.value)
                    setSelectedTrailerIndexes([...selectedTrailerIdexes, parseInt(event.currentTarget.value)])
                }}
            >
                <option>Choose a game</option>
                {trailers.map((trailer, index) => !selectedTrailerIdexes.includes(index) &&
                    <option
                        value={index} key={`select-option-${index}`}
                    >
                        {trailer.gameTitle}
                    </option>
                )}
            </select>
            <p>Number of selected trailers: {selectedTrailerIdexes.length}</p>
            {
                selectedTrailerIdexes.length > 0 ? <>
                    <p>Selected games:</p>
                    <ul>
                        {selectedTrailerIdexes.map(selectedIndex =>
                            <li key={`selected-${selectedIndex}`}>
                                <span><button onClick={() => { setSelectedTrailerIndexes(selectedTrailerIdexes.filter(index => index !== selectedIndex)) }}>X</button> {trailers[selectedIndex].gameTitle}</span>
                            </li>
                        )}
                    </ul>
                    <h2 className='text-2xl'>Views</h2>
                    <TrailersChart trailers={selectedTrailers} accessorField="viewCount" xLabel="Date" yLabel="Views" />
                    <h2 className='text-2xl'>Likes</h2>
                    <TrailersChart trailers={selectedTrailers} accessorField="likeCount" xLabel="Date" yLabel="Likes" />
                    <h2 className='text-2xl'>Comments</h2>
                    <TrailersChart trailers={selectedTrailers} accessorField="commentCount" xLabel="Date" yLabel="Comments" />
                </> : <p>Please select some games first.</p>
            }
        </div>
    )
}

export async function getStaticProps() {
    const trailers = await getTrailers()
    return { props: { trailers } }
}

export default ComparePage