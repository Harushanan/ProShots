import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
)
reportWebVitals