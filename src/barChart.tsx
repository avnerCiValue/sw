import React, {useMemo} from "react"
import './barChart.css'

export type BarChartDataItem = {
    name: string;
    value: number;
    color?: any

}

type BarChartProps<T> = {
    data: T[]
}

const columnWidth = 160
const columnWidthSpace = 20

const numberFormatter = new Intl.NumberFormat()

const Bar=(props:{
    x:number;
    color:string;
    yTopPercents:number;
    heightPercents:number
    value:number
    name:string
})=>{
    return <svg  x={props.x} width={columnWidth}>
        <text fill={props.color} y={`${props.yTopPercents - 2}%`}
              x="50%"
              className="center"
              >{numberFormatter.format(props.value)} </text>
        <rect className="bar"  width={columnWidth}
              fill={props.color}
              y={`${props.yTopPercents}%`}
              height={`${props.heightPercents}%`}></rect>
        <text  y="94%" x="50%"
               className="center"
               fill={props.color}>{props.name}</text>

    </svg>

}
export const BarChart = <T extends BarChartDataItem>({data}: BarChartProps<T>) => {

    const filteredData=useMemo(()=>{
        return  data.filter(d => {
                const ok = d.value > 0;
                if (!ok) {
                    console.warn(`BarChart is currently supporting positive values, ignoring: `, d)
                    return false
                }
                return true
            }
        )
    },[data])
    const maxMin = useMemo(() => {

        if (filteredData.length === 0) {
            return undefined
        }
        const [first, ...rest] = filteredData;
        const dataMaxMin = rest.reduce((acc, val) => {
            return {
                max: Math.max(acc.max, val.value),
                min: Math.min(acc.min, val.value)
            }

        }, {max: first.value, min: first.value})


        if (Math.sign(dataMaxMin.min) === Math.sign(dataMaxMin.max)) {
            return Math.sign(dataMaxMin.min) > 0 ? {...dataMaxMin, min: 0} : {...dataMaxMin, max: 0}
        }
        return dataMaxMin


    }, [filteredData])


    type SeriesItem = {
        name: string,
        value: number,
        color?: string,
        yTopPercents: number,
        heightPercents: number,


    }
    const percentSeries = useMemo((): SeriesItem[] | undefined => {
        if (!filteredData || !maxMin) {
            return undefined
        }
        const scale = maxMin.max - maxMin.min


        return filteredData.map((i) => {
            const yPercents = (100 * i.value) / scale;
            return {
                name: i.name,
                value: i.value,
                heightPercents: yPercents,
                yTopPercents: 100 - yPercents,
                color: i.color
            }
        }).map(i => {
            return {
                ...i,
                heightPercents: i.heightPercents * 0.8,
                yTopPercents: (i.yTopPercents * 0.8 + 10)
            }
        })

    }, [filteredData, maxMin])



    return percentSeries ? (
        <svg width="100%" height="500">
            <g transform="translate(40,20)">
                {percentSeries.map((i, index) => {
                    const x = (index + 1) * (columnWidth + columnWidthSpace)
                    const color = i.color || colors[index % colors.length]
                    return (<Bar key={index} {...i} color={color} x={x}></Bar>)
                })}

            </g>
        </svg>
    ) : null
}

const colors = [
    '#9a6324', '#800000', '#aaffc3',
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
]
