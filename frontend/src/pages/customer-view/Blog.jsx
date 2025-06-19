import { assets } from '@/assets/assets'
import BookingForm from '@/components/customer-view/home/BookingForm'
import OldEvents from '@/components/customer-view/home/OldEvents'
import React from 'react'

const Blog = () => {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-[600px] bg-cover bg-center bg-[url("@/assets/blogBG.jpg")] mb-12'>
        <br />
        <br />
        <h1 className='text-2xl md:text-3xl text-white font-medium'>---  GALLERY  ---</h1>
        <h1 className='text-5xl md:text-7xl text-white font-medium'>BLOGS</h1>
        <p className='text-xl md:text-2xl text-white font-extralight'>welcome to our blog,</p>
        <p className='text-xl md:text-2xl text-white font-extralight'>Where every story is a celebration! </p>
        
        <BookingForm />
      </div>
      <OldEvents />
    </div>
  )
}

export default Blog
