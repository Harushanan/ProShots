import GalleryPage from '@/components/customer-view/GalleryPage/GalleryPage';
import AboutStudio from '@/components/customer-view/home/AboutStudio';
import BookingForm from '@/components/customer-view/home/BookingForm'
import OldEvents from '@/components/customer-view/home/OldEvents';
import Packages from '@/components/customer-view/home/Packages';
import SlideBar from '@/components/customer-view/home/SlideBar';
import { AnimatePresence, motion } from "framer-motion";
import React from 'react'
import { useOutletContext } from 'react-router-dom';

const Home = () => {
    const { currentTheme } = useOutletContext();

    const themeBackgrounds = {
        ocean: "from-blue-100 to-blue-100",
        forest: "from-green-100 to-green-100",
        royal: "from-purple-100 to-purple-100",
        blossom: "from-rose-100 to-rose-100",
        tropical: "from-emerald-100 to-emerald-100",
        golden: "from-amber-100 to-amber-100",
        berry: "from-fuchsia-100 to-fuchsia-100",
        misty: "from-gray-100 to-gray-100",
        sunset: "from-orange-100 to-orange-100",
        midnight: "from-indigo-100 to-indigo-100",
        coral: "from-rose-100 to-rose-100",
        sapphire: "from-blue-100 to-blue-100",
        emerald: "from-emerald-100 to-emerald-100",
        lavender: "from-purple-100 to-purple-100",
        amber: "from-amber-100 to-amber-100"
    };
    
    // Default to ocean theme if currentTheme is not found
    const bgClasses = themeBackgrounds[currentTheme] || themeBackgrounds.ocean;

    return (
        <div className=''>
            <div className='flex flex-col items-center justify-center w-full relative'>
                <div className={`w-full mb-16 md:m-0 md:mb-28 relative h-[500px] md:h-[700px] bg-gradient-to-b ${bgClasses}`}>
                    <SlideBar />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        className="relative mx-auto max-w-7xl overflow-hidden rounded-xl shadow-xl"
                        initial={{ opacity: 0, scale: 0.95, zIndex: -1 }}
                        animate={{ opacity: 1, scale: 1, zIndex: 0 }}
                        exit={{ opacity: 0, scale: 0.95, zIndex: -1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{
                            boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <AboutStudio currentTheme={currentTheme} />
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        className={`relative mt-20 bg-gradient-to-b ${bgClasses} py-8 px-4 sm:px-6 lg:px-8 xl:px-16 mx-auto w-full max-w-7xl overflow-hidden rounded-xl shadow-xl`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{
                            boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 my-8 lg:my-12 relative z-10 px-2 sm:px-0">
                            {/* Image with floating effect */}
                            <motion.div
                                className="w-full max-w-[400px] sm:w-[400px] lg:w-[500px] xl:w-[600px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-[url('@/assets/bookImg.jpg')] bg-cover bg-center rounded-lg shadow-xl"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ 
                                    scale: 1,
                                    opacity: 1,
                                    y: [0, -15, 0]
                                }}
                                transition={{
                                    scale: { duration: 0.5 },
                                    opacity: { duration: 0.7 },
                                    y: {
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                            />
                            
                            {/* Content with staggered animations */}
                            <motion.div 
                                className="w-full max-w-lg px-4 sm:px-0 text-center lg:text-left"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                            >
                                <motion.h1 
                                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    📸 Capture Moments, Create Memories!
                                </motion.h1>
                                
                                <motion.p 
                                    className="text-sm sm:text-base md:text-lg text-center text-gray-600 mt-3 sm:mt-5"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Every smile, every laugh, every precious moment—frozen in time with stunning photography! 
                                    Whether it's a Wedding, engagement, birthday, or special event, we bring your memories 
                                    to life with breathtaking images.
                                </motion.p>
                                
                                <motion.p 
                                    className="text-sm sm:text-base md:text-lg text-gray-600 text-center mt-3 sm:mt-4 font-semibold"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    📅 Book your session today and let's create magic together!  
                                </motion.p>
                                
                                <motion.p 
                                    className="text-red-600 font-bold mt-6 sm:mt-12 text-center lg:text-center animate-pulse"
                                    initial={{ scale: 0.9 }}
                                    animate={{ 
                                        scale: 1,
                                        transition: {
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            duration: 1.5
                                        }
                                    }}
                                >
                                    ✨ Limited slots available—reserve now! ✨
                                </motion.p>

                                <motion.div
                                    className="mt-2 sm:mt-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <BookingForm />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    className={`relative mt-20 bg-gradient-to-b ${bgClasses} py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl overflow-hidden rounded-xl shadow-xl`}
                    initial={{ opacity: 0, scale: 0.95, zIndex: -1 }}
                    animate={{ opacity: 1, scale: 1, zIndex: 0 }}
                    exit={{ opacity: 0, scale: 0.95, zIndex: -1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                        boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Recent Events</h2>
                        <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-4">
                            View Our Works here
                        </p>

                        <div className="relative">
                            <OldEvents currentTheme={currentTheme} />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <p className='h-16'></p>
            
            <Packages currentTheme={currentTheme}/>
        </div>
    );
}

export default Home