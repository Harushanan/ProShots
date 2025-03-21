import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Readallfb from './readallfb'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Readallfb/>
  </StrictMode>,
)
