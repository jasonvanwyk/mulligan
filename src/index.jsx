import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import './styles/tailwind.css';

// Configure axios
axios.defaults.baseURL = 'http://localhost:8001';
axios.defaults.withCredentials = true;  // Important for CORS with credentials

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
); 