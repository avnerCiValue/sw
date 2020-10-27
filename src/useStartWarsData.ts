import api, {Person, Planet, Vehicle } from "./api";
import {useEffect, useMemo, useState} from "react";

export type StarWarsData={
    planets:Planet[]
    people:Person[]
    vehicles:Vehicle[]
}
type StartWarsDataRes={isLoading:boolean,error:any,data:StarWarsData|undefined}


export const useStartWarsData=():StartWarsDataRes=>{
    const [callState,setCallState]= useState<{type:'error',error:any}|{type:'ready',data:StarWarsData}|{type:'loading'}>({type:'loading'})

    const calls=useMemo(()=>[
        {key:'planets',getData:api.getAllPlanets},
        {key:'people',getData:api.getAllPeople},
        {key:'vehicles',getData:api.getAllVehicles},
        ],[])
    useEffect(()=>{

        Promise.all(calls.map(i=>{
            return  i.getData() as any
        } )).then(((allRes)=>{
            setCallState({
                type:'ready',
                data:allRes.reduce((acc:any,val,index):StarWarsData=>{
                    acc[calls[index].key]=val
                    return  acc
                },{} as StarWarsData)
            })
        })).catch((error:any)=>{
            setCallState({type:"error",error})
        })


    },[])

    const startWarsDataRes= useMemo(():StartWarsDataRes=>{
        switch (callState.type){
            case "error":{
                return {isLoading:false,error:callState.error,data:undefined}
            }
            case "ready":{
                return {isLoading:false,error:undefined,data:callState.data}
            }
            case "loading":{
                return {isLoading:true,error:undefined,data:undefined}
            }

        }




    },[callState])
    return startWarsDataRes

}