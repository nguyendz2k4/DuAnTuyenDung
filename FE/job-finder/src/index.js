import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import './style/style.scss';
import { FavoriteProvider } from './context/FavoriteContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <FavoriteProvider>  
            <RouterCustom />
        </FavoriteProvider>  
    </BrowserRouter>
);