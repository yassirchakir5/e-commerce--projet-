import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Bar from './pages/Bar'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Infos from './pages/infos'
import Login from './pages/Login'
import Inscrit from './pages/Inscrit'
import Home from './pages/Home'


const root = ReactDOM.createRoot(document.getElementById('root'));

function Index(){
  const [connected,setconnected] = useState(true);
  return(
    <BrowserRouter>
      <Bar connected={connected}/>
      <Routes>
        <Route path='/' element={<Home />}/>
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
