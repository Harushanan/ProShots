import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Readallfb from './feedback/Readallfb'
import Intertfb from './feedback/Insertfb'
import Deliveryadmin from './delivery/deliveryadmin'


createRoot(document.getElementById('root')).render(
  <StrictMode><>
    <Intertfb />
    <Readallfb/>
    <Deliveryadmin/>
   
   </>
  </StrictMode>,
)
