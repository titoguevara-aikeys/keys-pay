import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { WebVitals } from './components/WebVitals'

// Load CSS asynchronously to avoid render blocking
const loadCSS = () => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/src/index.css'
  link.media = 'print'
  link.onload = () => { link.media = 'all' }
  document.head.appendChild(link)
}

// Load CSS after initial render
setTimeout(loadCSS, 0)

// All security features disabled for development

createRoot(document.getElementById("root")!).render(
  <>
    <WebVitals />
    <App />
  </>
);
