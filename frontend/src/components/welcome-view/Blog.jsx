import React from 'react'
import OldEvents from '../customer-view/home/OldEvents'
import logo from '../../assets/LogoHome.jpeg';
import { Link, useNavigate } from 'react-router-dom';

const BlogHome = () => {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 flex flex-col">
        {/* Header (unchanged) */}
            <header className="py-0 border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <img 
                                src={logo} 
                                alt="ProShots Logo" 
                                onClick={()=>navigate('/')}
                                className="h-24 w-auto"
                            />
                        </div>
                        <nav className="ml-auto hidden md:block">
                            <ul className="flex space-x-8">
                                <li><Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium">Home</Link></li>
                                <li><Link to="/common/blog" className="text-red-600 hover:text-purple-600 transition-colors duration-200 font-medium">Blog</Link></li>
                                <li><Link to="/common/contact" className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium">Contact</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
            
            <OldEvents />
    </div>
  )
} 

export default BlogHome
