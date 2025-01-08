'use client'
import React from 'react'
import SideHeader from '@/components/layouts/side-header';
import Circle from '@/components/charts/circle';
import HorizontalBar from '@/components/charts/horizontal-bar';
import Vertical from '@/components/charts/vertical-bar';
import { selectAuth } from '@/features/auth-slice';
import { useSelector } from 'react-redux';
import StudentPage from '@/components/sections/student';

const AdminPage = () => {
  const auth = useSelector(selectAuth)
  const breadcrumbsData = [
    { name: "Үзүүлэлт", path: "main" },
  ];

  return (
    <div>
      {auth?.role?.name !== 'Student' ? (
        <>
          <SideHeader breadcrumbs={breadcrumbsData}/>
          <div className='p-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
            <Circle />
            <Vertical />
            <HorizontalBar />
          </div>
        </>
      ): (
        <StudentPage/>
      )}
    </div>
  )
}

export default AdminPage
