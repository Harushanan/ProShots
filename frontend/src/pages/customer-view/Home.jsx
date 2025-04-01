import GalleryPage from '@/components/customer-view/GalleryPage/GalleryPage';
import AboutStudio from '@/components/customer-view/home/AboutStudio';
import BookingForm from '@/components/customer-view/home/BookingForm'
import OldEvents from '@/components/customer-view/home/OldEvents';
import SlideBar from '@/components/customer-view/home/SlideBar';
import React from 'react'

const Home = () => {
    return (
        <div>
            <div className='flex flex-col items-center justify-center w-full relative'>
                <div className='w-full mb-16 md:m-0 md:mb-28 relative h-[500px] md:h-[700px]'>
                    <SlideBar />
                </div>

                <AboutStudio />

                <div className='flex flex-wrap items-center justify-center gap-10'>
                    <div className="bg-center bg-no-repeat w-[400px] md:w-[600px] h-[300px] md:h-[400px] bg-[url('@/assets/bookImg.jpg')]" ></div>        
                    <div className="max-w-lg text-center md:text-left">
                        <h1 className="text-lg md:text-2xl font-bold text-gray-800 text-center">📸 Capture Moments, Create Memories!</h1>
                        <p className="text-base md:text-lg text-gray-600 mt-5 text-center pl-3 pr-3">
                            Every smile, every laugh, every precious moment—frozen in time with stunning photography! 
                            Whether it’s a Wedding, engagement, birthday, or special event, we bring your memories 
                            to life with breathtaking images.
                        </p>
                        <p className="text-base md:text-lg text-gray-600 mt-4 font-semibold text-center">
                            📅 Book your session today and let’s create magic together!  
                        </p>
                        <p className="text-red-600 font-bold mt-10 text-center">✨ Limited slots available—reserve now! ✨</p>

                        <div>
                            <BookingForm />
                        </div>
                    </div>
                </div>
                
            </div>
            <h1 className="text-center text-2xl md:text-4xl font-extrabold text-gray-800 mt-32 mb-10 uppercase tracking-wide">
                ✨ Recent Events ✨
            </h1>
            <OldEvents />
        </div>
    );
}

export default Home
