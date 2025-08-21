import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WebVitals } from './components/WebVitals'

// Only import security modules in production to prevent auth interference
if (process.env.NODE_ENV === 'production') {
  import('./lib/platformSecurity')
  import('./utils/ownerProtection')
}

createRoot(document.getElementById("root")!).render(
  <>
    <WebVitals />
    <App />
  </>
);
