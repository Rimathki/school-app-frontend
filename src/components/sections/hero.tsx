'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

const Hero = () => {
    const router = useRouter();
    return (
        <div className="relative isolate max-h-screen">
            <svg
                className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true"
            >
                <defs>
                    <pattern id="0787a7c5-978c-4f66-83c7-11c213f99cb7" width="200" height="200" x="50%" y="-1"
                        patternUnits="userSpaceOnUse">
                        <path d="M.5 200V.5H200" fill="none"></path>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" strokeWidth="0" fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"></rect>
            </svg>
            <div className="py-24 sm:py-24 lg:pb-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Another TailwindCSS Product</h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">Description of the product and its features.</p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button className='uppercase' onClick={() => router.push('/login')}>Login our system</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
