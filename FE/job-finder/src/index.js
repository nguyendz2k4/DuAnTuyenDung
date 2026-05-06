import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import './style/style.scss';
import { AuthProvider } from './context/AuthContext';
import { FavoriteProvider } from './context/FavoriteContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <AuthProvider>
            <FavoriteProvider>  
                <RouterCustom />
            </FavoriteProvider>
        </AuthProvider>
    </BrowserRouter>
);