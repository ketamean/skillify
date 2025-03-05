import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import dotenv from 'dotenv'
dotenv.config()
process.env.SUPABASE_PUBLIC_KEY
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
