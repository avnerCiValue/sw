import React, {useEffect, useState} from "react";
import api, {Planet} from "./api";
import {BarChart, BarChartDataItem} from "./barChart";
import {Spinner} from "./Spinner";

type ChartItem = { planet: Planet } & BarChartDataItem

export const Q2 = () => {
    const [tableData, setTableData] = useState<ChartItem[] | undefined>(/*[

        {value:6666,name:'abcdefg',planet:{} as any},
        {value:70055,name:'aaa',planet:{} as any},
        {value:0,name:'aaa',planet:{} as any},
        {value:-70055,name:'aaa',planet:{} as any},
        {value:70055,name:'aaa',planet:{} as any},
        {value:80,name:'aad',planet:{} as any},
        {value:7555,name:'aaa',planet:{} as any},
        {value:70055,name:'aaa',planet:{} as any},
    ]*/);

    //todo return this
    useEffect(() => {
        api.getAllPlanets().then((planets) => {
            const leavePlanets = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']


            const chartData = planets.filter(p => leavePlanets.find(n => n === p.name))
                .map((p): ChartItem | undefined => {
                    return p.population ? {
                        name: p.name,
                        value: p.population,
                        planet: p
                    } : undefined
                }).filter((i): i is ChartItem => !!i)
            console.log(JSON.stringify(chartData))
            setTableData(chartData)
        })
    },[])
    return <div>

        <div>
            <Spinner loading={!tableData}>
                {tableData &&<BarChart data={tableData}/>}
            </Spinner>

        </div>
    </div>


}