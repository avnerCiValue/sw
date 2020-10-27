const ROOT_URL = "https://swapi.dev/api/";


type PaginationResult<T> = {
    count: number
    next: string | null
    previous: string | null

    results: T[]
}
type PlanetDto={
    "name": string,
    "population": 'unknown'| string,
    "residents": string[]
    "url": string
}
export type Planet ={
    "name": string,
    "population": number,
    "residents": string[]
    "url": string
}
export type  Person = {


    homeworld: string,
    name: string,
    starships: string [],
    url: string,
    vehicles: string []
}
export type Vehicle = {

    name: string,
    pilots: string [],
    url: string,
    vehicle_class: string //"wheeled"
}


const getAllResource = <T extends {}> (url: string): Promise<T[]> => {
    return new Promise<T[]>((done, reject) => {
        let data: T[] = []
        const fetchData = (url: string) => {
            fetch(url).then((r) =>{
                return (!r.ok) ?reject(r.status): r.json().then((res: PaginationResult<T>) => {
                data= res.results?[...data,...res.results]:data
                res.next?fetchData(res.next):done(data)

            })}).catch(reject)
        }
        fetchData(url)
    })
}




const api = {
    getAllPeople: () => {
       return  getAllResource<Person>(ROOT_URL + 'people/')
    },
    getAllVehicles: () => {
        return  getAllResource<Vehicle>(ROOT_URL + 'vehicles/')
    },
    getAllPlanets: () => {
        return  getAllResource<PlanetDto>(ROOT_URL + 'planets/').then((plants):Planet[]=>{
            return plants.map(p=>{
               return {
                    ...p,
                    population:p.population==="unknown"?0: parseInt(p.population,10)
                }
            })
        })
    }
}

export default api