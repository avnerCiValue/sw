import React from "react";

export const Spinner:React.FunctionComponent<{loading?:boolean}> =(props)=>{
    return props.loading?<img src="128.png" className="App-logo" alt="logo" />:<div className="fade-in">{props.children}</div>

}