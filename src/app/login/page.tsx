import React from 'react'
import Login from '@/components/sections/login'

const Page = () => {
  return (
    <div className='h-screen grid grid-cols-1 md:grid-cols-2'>
      <div className='relative h-full'>
          <div className='flex items-center justify-center flex-col max-w-sm mx-auto h-screen pt-10 md:pt-0 pb-10 px-3'>
              <h1 className='text-slate-700 text-3xl font-bold mb-5 dark:text-gray-50 uppercase'>Login to AI-DRIVEN QUIZZES</h1>
              <Login/>
          </div>
      </div>
      <div className='bg-slate-900 dark:bg-gray-50 h-full hidden md:flex'>
          <div className='flex justify-center items-center w-full h-full'>
            <h1 className="text-white uppercase text-5xl">AI-DRIVEN QUIZZES</h1>
            <ul>
              <li>Admin: 
                <ul>
                  <li>username:admin</li>
                  <li>password:admin123</li>
                </ul>
              </li>
              
              <li>Teacher:
                <ul>
                  <li>username:teacher</li>
                  <li>password:12345678</li>
                </ul>
              </li>
              <li>Student:
                <ul>
                  <li>username:student</li>
                  <li>password:12345678</li>
                </ul>
              </li>
            </ul>
          </div>
      </div>
    </div>
  )
}

export default Page
