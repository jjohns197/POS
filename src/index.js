import React from 'react';
import ReactDOM from 'react-dom/client'; // This is updated for React 18
import './index.css';
import App from './App';

// This is the updated method to render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);