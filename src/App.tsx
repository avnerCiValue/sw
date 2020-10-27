import React, {useState} from 'react';
import './App.css';
import {Q2} from "./Q2";
import {Q1} from "./Q1";

function App() {
  const [page,setPage]=useState<'Q1'|'Q2'>("Q1")





  return (
    <div className="App">
      <header className="App-header">

          Star-Wars
      </header>
      <div>
      <div>

          <button disabled={page==='Q1'} onClick={()=>setPage("Q1")}>Question 1</button>
          <button disabled={page==='Q2'} onClick={()=>setPage("Q2")}>Question 2</button>

        </div>

          {page==="Q1"&& <Q1/>}
          {page==="Q2"&& <Q2/>}

      </div>

    </div>
  );
}

export default App;
