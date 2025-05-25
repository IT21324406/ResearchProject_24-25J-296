import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp from './MainApp';
import reportWebVitals from './reportWebVitals';
import { PreferencesProvider } from './pages/PreferencesContext';

const root = ReactDOM.createRoot(document.getElementById('second-root'));
root.render(
  <React.StrictMode>
    <PreferencesProvider>
      <MainApp />
    </PreferencesProvider>
  </React.StrictMode> 
);

reportWebVitals();