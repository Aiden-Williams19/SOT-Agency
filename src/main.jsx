import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mount React app into #root with React 18 concurrent features
createRoot(document.getElementById('root')).render(
  // StrictMode helps catch side-effect bugs during development
  <StrictMode>
    <App />
  </StrictMode>,
)
