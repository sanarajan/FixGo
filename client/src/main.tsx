import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'keen-slider/keen-slider.min.css';

import App from './App.tsx'
//axios.defaults.baseURL = 'http://localhost:5000'; 
//axios.defaults.withCredentials = true;
import "./api/axiosClient.ts";
import "./api/customerAxiosClient.ts";

import Store, { persistor } from './redux/Store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from "react-redux";

import { GoogleOAuthProvider } from '@react-oauth/google';//google auth

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <GoogleOAuthProvider clientId='342522501659-0tqua9nf1f0kbjqe4us32r1cb2tg1fvf.apps.googleusercontent.com'>
    <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
  </StrictMode>,
)
