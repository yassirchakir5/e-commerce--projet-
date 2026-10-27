import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Bar from './component/Bar';
import Infos from './component/infos';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./component/Login";
import Inscrit from './component/Inscrit';


const root = ReactDOM.createRoot(document.getElementById('root'));

function Index(){
  const [connected,setconnected] = useState(false);
  return(
    <BrowserRouter>
      <Bar connected={connected}/>
      <Routes>
        <Route path='/infos' element={<Infos />} />
        <Route path='/login' element={<Login connected={connected} setconnected={setconnected}/>}/>
        <Route path='/inscrit' element={<Inscrit />} />
      </Routes>
    </BrowserRouter>
  );
}
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
reportWebVitals();
