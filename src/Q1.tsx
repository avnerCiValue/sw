import './Q1.css'
import React, {useEffect, useMemo} from "react";
import api, {Person, Planet, Vehicle} from "./api";
import {useStartWarsData} from "./useStartWarsData";
import {Spinner} from "./Spinner";


const convertToMapper = <T extends { url: string }>(arr: T[]): { [k: string]: T } => {
    const emptyAcc: { [k: string]: T } = {};
    return arr.reduce((acc, val) => {
        acc[val.url] = val;
        return acc

    }, emptyAcc)

}

type TableRow = {
    vehicle: Vehicle,
    sum: number,
    pilots: Person[],
    planets: Planet[]

}
const numberFormatter = new Intl.NumberFormat()
export const Q1 = () => {
    const {error, data, isLoading} = useStartWarsData()

    //Which vehicle names have the highest sum of population for all its pilots’ home planets
    const tableData = useMemo(() => {
            if (data) {
                const peopleMapper = convertToMapper(data.people)
                const planetsMapper = convertToMapper(data.planets)
                const tableData = data.vehicles.map((vehicle): TableRow => {
                    const rowPilots = vehicle.pilots.map(pId => peopleMapper[pId])
                    const emptyAcc: { [k: string]: Planet } = {}
                    const uniqPlanets = rowPilots.reduce((acc, pilot) => {
                        acc[pilot.homeworld] = planetsMapper[pilot.homeworld];
                        return acc
                    }, emptyAcc)

                    const planets: Planet[] = Object.values(uniqPlanets);
                    return {
                        pilots: rowPilots,
                        planets,
                        sum: planets.reduce((acc, val) => {
                            return val.population ? acc + val.population : acc
                        }, 0),
                        vehicle: vehicle
                    }

                })

                return tableData.sort((a, b) => b.sum - a.sum)

            }


        },
        [data])

    return <div>
        <Spinner loading={isLoading}>
            <div className="card">

                {tableData && <table className="table">
                    <tr>
                        <th> Vehicle name with the largest sum</th>
                        <th>Related home planets and their respective population</th>
                        <th>Related pilot names</th>
                    </tr>
                    {tableData.map(r => (
                        <tr key={r.vehicle.name}>
                            <td>{r.vehicle.name} ({numberFormatter.format(r.sum)})</td>
                            <td>{r.planets.map(p => <div
                                key={p.name}>{p.name} ,{numberFormatter.format(p.population)} </div>)}</td>
                            <td>{r.pilots.map(p => <div key={p.name}>{p.name} </div>)}</td>
                        </tr>
                    ))}


                </table>

                }
            </div>
        </Spinner>
    </div>

}