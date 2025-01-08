import React from 'react'
import Header from '../layouts/header'
import Circle from '../charts/circle'
import Vertical from '../charts/vertical-bar'
import HorizontalBar from '../charts/horizontal-bar'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/features/auth-slice'

const StudentPage = () => {
    const auth = useSelector(selectAuth)
    return (
        <div>
            <Header/>
            <div className="relative h-[400px] bg-gradient-to-tr from-blue-400 via-blue-500 to-teal-400">
                <div className="flex flex-col gap-4 justify-center items-center w-full h-full px-3 md:px-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase">
                        Show your rating 
                    </h1>
                    <p className="text-gray-50 text-lg">
                        Student: { auth?.firstname }
                    </p>
                </div>
            </div>
            <div className='p-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
                <Circle />
                <Vertical />
                <HorizontalBar />
            </div>
        </div>
    )
}

export default StudentPage
