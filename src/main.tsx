import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Container/App.tsx'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./Storage";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './Utilities/localization.ts'; // 👈 Import here

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
  </React.StrictMode>
);
