'use client';

import { useGetStudentsByTeacherQuery } from '@/api/users';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SideHeader from '@/components/layouts/side-header';

const Page = () => {
  const teacherId = '80';
  const { data, isLoading, error } = useGetStudentsByTeacherQuery(teacherId);

  console.log(data);

  if (isLoading) return <p>Loading students...</p>;
  if (error) return <p>Error fetching students</p>;

  return (
    <div className="flex flex-col h-screen">
        <div className="flex-shrink-0">
            <SideHeader breadcrumbs={[{ name: 'System', path: '/system' }, { name: 'Teacher', path: 'main' }, { name: 'Students', path: 'main' }]} />
        </div>
        <div className='mt-5 mx-10'>
            <Table>
                <TableCaption>List of students assigned to the {data?.teacher.firstname}</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.teacher?.students?.map((student, index) => (
                        <TableRow key={index}>
                            <TableCell>{index +1}</TableCell>
                            <TableCell>{student.lastname}</TableCell>
                            <TableCell>{student.firstname}</TableCell>
                            <TableCell>{student.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  );
};

export default Page;
