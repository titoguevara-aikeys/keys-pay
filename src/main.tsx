import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WebVitals } from './components/WebVitals'

createRoot(document.getElementById("root")!).render(
  <>
    <WebVitals />
    <App />
  </>
);
