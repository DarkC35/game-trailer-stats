import { extent, max, min } from 'd3-array'
import { schemeSet1 } from 'd3-scale-chromatic';
import { scaleLinear, scaleOrdinal, scaleTime } from '@visx/scale'
import { Circle, LinePath } from '@visx/shape'
import { Group } from '@visx/group'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Trailer, Trailers } from '../lib/trailers'
import { Statistic } from '@prisma/client'
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend'
import slugify from 'slugify';
import Link from 'next/link';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { ParentSize } from '@visx/responsive';

interface Props {
    trailers: Trailers,
    xLabel?: string,
    yLabel?: string,
    accessorField: 'viewCount' | 'likeCount' | 'commentCount',
    isSingleTrailer?: boolean,
    colorScaleDomain?: string[],
    colorScaleRange?: string[]
    colorScaleMapperFunc?: (trailer: Trailer) => string | undefined
}

type TooltipData = {
    data: Statistic
    key: string
}

const width = 500
const height = 350

const margin = {
    top: 20,
    left: 70,
    bottom: 40,
    right: 10
}

const TrailersChart = ({ trailers, yLabel, xLabel, accessorField, isSingleTrailer, colorScaleDomain, colorScaleRange, colorScaleMapperFunc }: Props) => {

    const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<TooltipData>()
    const { containerRef, TooltipInPortal } = useTooltipInPortal({ scroll: true })

    const getX = (d: Statistic) => d.date
    const getY = (d: Statistic) => d[accessorField]
    const allStatistics = trailers.reduce((prev, curr) => {
        return [...prev, ...curr.statistics]
    }, [] as Statistic[])
    // const xMax = width - margin.left - margin.right
    // const xScale = scaleTime<number>({
    //     domain: extent(allStatistics, getX) as [Date, Date],
    //     range: [0, xMax]
    // })
    // const yMax = height - margin.top - margin.bottom
    // const yScale = scaleLinear<number>({
    //     domain: [min(allStatistics, getY) as number, max(allStatistics, getY) as number],
    //     // domain: [0, max(allStatistics, getY) as number],
    //     range: [yMax, 0],
    // })
    const ordinalColorScale = scaleOrdinal({
        domain: colorScaleDomain || trailers
            .sort((a, b) => b.statistics[0][accessorField] - a.statistics[0][accessorField])
            .map(trailer => trailer.gameTitle),
        range: colorScaleRange || [...schemeSet1]
    })

    return (
        <>
            {/* <div className='w-100 h-100'> */}
            <div className='w-100 h-96'>
                <ParentSize debounceTime={10}>
                    {({ width: visWidth, height: visHeight }) => {
                        const xMax = visWidth - margin.left - margin.right
                        const xScale = scaleTime<number>({
                            domain: extent(allStatistics, getX) as [Date, Date],
                            range: [0, xMax]
                        })
                        const yMax = visHeight - margin.top - margin.bottom
                        const yScale = scaleLinear<number>({
                            domain: [min(allStatistics, getY) as number, max(allStatistics, getY) as number],
                            // domain: [0, max(allStatistics, getY) as number],
                            range: [yMax, 0],
                        })
                        return (
                            <svg ref={containerRef} width={visWidth} height={visHeight}>
                                {trailers.map(trailer =>
                                    <Group key={`trailer-${trailer.id}-${accessorField}-line`} top={margin.top} left={margin.left}>
                                        <LinePath
                                            strokeWidth={3}
                                            stroke={isSingleTrailer ? '#353535' : ordinalColorScale(colorScaleMapperFunc?.(trailer) || trailer.gameTitle)}
                                            data={trailer.statistics}
                                            x={d => xScale(getX(d)) ?? 0}
                                            y={d => yScale(getY(d)) ?? 0}
                                        />
                                        {
                                            trailer.statistics.map(statistic =>
                                                <Circle
                                                    key={`trailer-${trailer.id}-${accessorField}-line-${statistic.date.toISOString()}`}
                                                    id={`${trailer.id}-${statistic.date.toISOString()}`}
                                                    cx={xScale(getX(statistic))}
                                                    cy={yScale(getY(statistic))}
                                                    stroke="black"
                                                    fill="black"
                                                    r={4}
                                                    onMouseMove={(event) => {
                                                        const eventSvgCoords = localPoint(event)
                                                        console.log(eventSvgCoords)
                                                        showTooltip({
                                                            tooltipData: {
                                                                data: statistic,
                                                                key: trailer.gameTitle
                                                            },
                                                            tooltipTop: eventSvgCoords?.y,
                                                            tooltipLeft: eventSvgCoords?.x
                                                        })
                                                    }}
                                                    onMouseLeave={() => hideTooltip()}
                                                />)
                                        }
                                    </Group>
                                )}
                                <AxisBottom top={yMax + margin.top} left={margin.left} scale={xScale} label={xLabel || 'Date'} />
                                <AxisLeft top={margin.top} left={margin.left} scale={yScale} label={yLabel || accessorField}
                                // tickFormat={
                                //     (v: number) =>
                                //         (v / 1000000) > 1
                                //             ? `${(v / 1000000).toLocaleString('en-US')}M`
                                //             : (v / 1000) > 1
                                //                 ? `${(v / 1000).toLocaleString('en-US')}K`
                                //                 : `${v.toLocaleString('en-US')}`
                                // }
                                />
                            </svg>
                        )
                    }}
                </ParentSize>
            </div>
            {
                !isSingleTrailer && !colorScaleDomain && <LegendOrdinal scale={ordinalColorScale} itemDirection='row'>
                    {(labels) =>
                        labels.map(label => {
                            const trailer = trailers.filter(trailer => trailer.gameTitle === label.text)[0]
                            return (
                                <LegendItem key={`legend-item-${slugify(label.text)}`}>
                                    <svg width={5} height={5}>
                                        <rect fill={label.value} width={5} height={5} />
                                    </svg>
                                    <LegendLabel>
                                        <Link href={`/trailer/${trailer.id}`}><a>{label.text} ({trailer.statistics[0][accessorField]})</a></Link>
                                    </LegendLabel>
                                </LegendItem>)
                        }
                        )
                    }
                </LegendOrdinal>
            }
            {
                tooltipOpen && tooltipData &&
                <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
                    <div>{!isSingleTrailer && <p>{tooltipData.key}</p>}<p>{`${tooltipData.data.date.toDateString()}: ${tooltipData.data[accessorField]}`}</p></div>
                </TooltipInPortal>
            }
            {/* </div> */}
        </>
    )
}

export default TrailersChart
