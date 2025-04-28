import React from 'react'
import { Outlet } from 'react-router-dom'

const ColorSetUp = () => {
  return (
    <div className="overflow-x-hidden bg-gradient-to-br bg-[#e0f7fa] min-h-screen"> 
        <main className="relative z-1">
            <Outlet />
        </main>
    </div>
  )
}

export default ColorSetUp
