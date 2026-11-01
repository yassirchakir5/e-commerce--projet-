import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Bar from './pages/Bar'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import Infos from './pages/infos'
import Login from './pages/Login'
import Inscrit from './pages/Inscrit'
import Home from './pages/Home'
import Mesproduct from './component/mesproduct';
import Derrniprodu from './component/derniprodu';
import Products from './data/product.json';
import Telephone from './component/telephone';
import Vêtements from './component/Vêtements';
import Electronique from './component/electronique';
import Vêtementsh from './component/Vêtementsh';
import Computer from './component/computer';
import Casques from './component/Casque';
import Favoris from './component/favoris';
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Index(){
  const [connected,setconnected] = useState(true);
  return(
    <CartProvider>
      <BrowserRouter>
        <Bar connected={connected}/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/infos' element={<Infos />} />
          <Route path='/login' element={<Login connected={connected} setconnected={setconnected}/>}/>
          <Route path='/inscrit' element={<Inscrit />} />
          <Route path='/mesproduct' element={<Mesproduct />} />
          <Route path='/dernierprodu' element={<Derrniprodu filterpro={Products}/>} />
          <Route path='/categorie/telephone' element={<Telephone product={Products}/>} />
          <Route path='/categorie/Vetements' element={<Vêtements product={Products}/>} />
          <Route path='/categorie/Electronique' element={<Electronique product={Products}/>} />
          <Route path='/categorie/Vetementsh' element={<Vêtementsh product={Products}/>} />
          <Route path='/categorie/Computer' element={<Computer product={Products}/>} />
          <Route path='/categorie/Casques' element={<Casques product={Products}/>} />
          <Route path='/mesfavoris' element={<Favoris product={Products}/>} />
          <Route path='*' element={<Navigate to="/" replace />}/>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
reportWebVitals();
