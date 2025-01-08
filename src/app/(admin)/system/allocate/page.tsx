'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SideHeader from '@/components/layouts/side-header';
import { 
    useGetAllTeachersQuery,
    useAddStudentToTeacherMutation,
    useRemoveStudentFromTeacherMutation
} from '@/api/users';
import { useSelector } from 'react-redux';
import { formatQuery } from '@/utils/format';
import { teachersColumns } from '@/components/table/columns';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import MainDialog from '@/components/elements/main-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Combobox } from '@/components/elements/combobox';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { allocateStudents } from '@/utils/validation';
import { 
    setQuery, 
    selectQuery,
    selectStudents,
    loadStudents
} from "@/features/user-slice";
import { useAppDispatch } from '@/lib/store';
import Pagination from '@/components/table/pagination';
import { useToast } from '@/hooks/use-toast';

const Page = () => {
    const breadcrumbsData = [
        { name: "System", path: "/system" },
        { name: "Allocate students", path: "main" },
    ];

    const dispatch = useAppDispatch();
    const [isAddStudentDialog, setAddStudentDialog] = useState<boolean>(false);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>('');
    const query = useSelector(selectQuery);
    const { data, error, isLoading } = useGetAllTeachersQuery(formatQuery(query));
    const [addStudentToTeacher] = useAddStudentToTeacherMutation();
    const [removeStudentFromTeacher] = useRemoveStudentFromTeacherMutation();
    const students = useSelector(selectStudents);
    const { toast } = useToast();

    const pagination = useMemo(() => {
        if (data?.pagination) return data.pagination;
        else return null;
    }, [data]);

    const addStudentForm = useForm<z.infer<typeof allocateStudents>>({
        resolver: zodResolver(allocateStudents),
        defaultValues: {
            user_id: '',
        },
    });

    useEffect(() => {
        if (students?.length === 0) dispatch(loadStudents());
    }, [dispatch, students]);

    const tableData = data?.teachers.map((teacher) => ({
        id: teacher.id,
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        email: teacher.email,
        phone: teacher.phone,
        role: teacher.role,
        lessons: teacher.lessons,
        students: teacher.students,
    })) || [];

    const availableStudents = useMemo(() => {
        if (selectedTeacher && students) {
            const teacher = data?.teachers.find((t) => t.id === selectedTeacher);
            const assignedStudentIds = teacher?.students?.map((s) => s.id) || [];
            return students.filter((student) => !assignedStudentIds.includes(student.id));
        }
        return students || [];
    }, [students, selectedTeacher, data]);

    const handlePage = useCallback(
        (value: number) => dispatch(setQuery({ page: value })),
        [dispatch]
    );

    const handleLimitChange = useCallback(
        (newLimit: number) => {
            dispatch(setQuery({ limit: newLimit }));
        },
        [dispatch]
    );

    const addStudents = (teacherId: string) => {
        setSelectedTeacher(teacherId);
        setAddStudentDialog(true);
    };

    const handleAddStudents = async (data: z.infer<typeof allocateStudents>) => {
        if (selectedTeacher && data.user_id) {
            try {
                const response = await addStudentToTeacher({
                    teacherId: selectedTeacher,
                    studentId: String(data.user_id),
                }).unwrap();

                if (response.success) {
                    toast({
                        title: 'Success',
                        description: response.message,
                    });
                }
            } catch (error) {
                console.error('Error adding student to teacher:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to assign student to teacher.',
                });
            }
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (selectedTeacher) {
            try {
                const response = await removeStudentFromTeacher({
                    teacherId: selectedTeacher,
                    studentId,
                }).unwrap();
    
                if (response.success) {
                    toast({
                        title: "Success",
                        description: response.message,
                    });
                }
            } catch (error) {
                console.error("Error removing student from teacher:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to remove student from teacher.",
                });
            }
        }    
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
                <SideHeader breadcrumbs={breadcrumbsData} />
            </div>
            <div className="flex-auto rounded-md max-h-full overflow-y-auto px-10">
                <Datatable
                    tableData={tableData}
                    columns={teachersColumns(addStudents)}
                    isLoading={isLoading}
                    error={!!error}
                    pagination={{
                        start: pagination?.start ?? 1,
                        pageSize: pagination?.limit ?? 25,
                    }}
                >
                    <div className="w-full flex justify-end">
                        <div className="flex gap-x-2">
                            <Button className="w-full bg-blue-400 hover:bg-blue-500 px-10" onClick={() => {}}>
                                Search teacher
                            </Button>
                            <Button className="w-full bg-green-500 hover:bg-green-600 px-10" onClick={() => {}}>
                                Export
                            </Button>
                        </div>
                    </div>
                </Datatable>
            </div>
            <div className="grow-0 shrink basis-1 px-5 lg:px-10 flex justify-between w-full">            
                {pagination !== null && pagination?.total > 4 && (
                    <Pagination pagination={pagination} select={handlePage} handleChangeLimit={handleLimitChange}/>
                )}
            </div>
            <MainDialog
                title="Add students in teacher"
                description="Add or remove students for the teacher"
                isOpen={isAddStudentDialog}
                onClose={() => {
                    setAddStudentDialog(false);
                    setSelectedTeacher(null);
                    addStudentForm.reset();
                }}
            >
                <div className="space-y-4">
                    <Form {...addStudentForm}>
                        <form onSubmit={addStudentForm.handleSubmit(handleAddStudents)} className="space-y-2">
                            <FormField
                                control={addStudentForm.control}
                                name="user_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select student</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={availableStudents?.map((student) => ({
                                                    value: student.id,
                                                    label: `${student.lastname.substring(0, 1)}. ${student.firstname}`,
                                                })) || []}
                                                defaultValue={field.value as string}
                                                placeholder="Select a student"
                                                onChange={(value) => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Add student</Button>
                        </form>
                    </Form>

                    {/* Table for Existing Students of the Teacher */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">Current Students</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.teachers
                                    ?.find((teacher) => teacher.id === selectedTeacher)
                                    ?.students?.map((student, index) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{`${student.firstname} ${student.lastname}`}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>
                                                <Button
                                                    className="bg-red-400 hover:bg-red-600"
                                                    onClick={() => handleRemoveStudent(student.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </MainDialog>
        </div>
    );
};

export default Page;
