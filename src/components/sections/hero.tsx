'use client'
import React from 'react'

const Hero = () => {
    return (
        <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
                <div className="flex justify-center">
                    <a className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-2 px-3 rounded-full transition hover:border-gray-300 focus:outline-none focus:border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-neutral-600" href="#">
                        School quiz management system
                    </a>
                </div>
                <div className="mt-5 max-w-3xl text-center mx-auto">
                    <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200">
                        Comprehensive School Quiz System
                        <span className="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"> for Enhanced Learning</span>
                    </h1>
                </div>

                <div className="mt-5 max-w-3xl text-center mx-auto">
                    <p className="text-lg text-gray-600 dark:text-neutral-400">A school quiz system is an innovative digital platform designed to foster interactive and engaging learning experiences for students. It offers a structured environment for conducting quizzes across various subjects and skill levels, helping educators assess students knowledge and understanding effectively.</p>
                </div>

                <div className="mt-8 gap-3 flex justify-center">
                    <a className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:from-violet-600 focus:to-blue-600 py-3 px-4" href="/login">
                        Login quiz system
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Hero
