import React from 'react'

const Footer = () => {
  return (
    <div className="w-full bg-black h-32 mt-10">
        <footer className="flex items-center justify-center h-full text-center text-white">
            <div>
                <p className="text-lg mt-2">© {new Date().getFullYear()} All rights reserved.  |   Made by ProShots</p>
            </div>
        </footer>
    </div>
  )
}

export default Footer
