import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WebVitals } from './components/WebVitals'

// All security features disabled for development

createRoot(document.getElementById("root")!).render(
  <>
    <WebVitals />
    <App />
  </>
);
