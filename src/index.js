import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Approutes from './routes/approutes';
import { CartProvider } from './context/CartContext';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <CartProvider>
      <Approutes />
    </CartProvider>
  </React.StrictMode>
);
reportWebVitals();
