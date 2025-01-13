import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router for routing
import { LoginProvider } from './LoginContext'; // Import LoginProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      {/* Wrap App inside LoginProvider to provide context */}
      <LoginProvider>
        <App />
      </LoginProvider>
    </Router>
  </React.StrictMode>
);

// Report Web Vitals if needed
reportWebVitals();
