import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Bar from './component/Bar';
import Infos from './component/infos';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Bar />
      <Routes>
        <Route path='/infos' element={<Infos />} />
      </Routes>
  </BrowserRouter>
);


reportWebVitals();
