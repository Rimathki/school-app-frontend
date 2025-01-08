'use client';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import ExcelHelper from '@/lib/excel-helper';
import SideHeader from '@/components/layouts/side-header';
import { 
    useGetLessonsQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useGetTopicsQuery,
    useCreateTopicMutation,
    useDeleteTopicMutation,
    useUpdateTopicMutation,
    useGetLessonTeachersQuery,
    useAddLessonTeacherMutation,
    useRemoveLessonTeacherMutation
} from '@/api/lesson';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import { lessonColumns } from '@/components/table/columns';
import MainDialog from '@/components/elements/main-dialog';
import { 
    lessonSchema, 
    topicSchema, 
    lessonTeacherSchema 
} from '@/utils/validation';
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import AlerDialog from '@/components/elements/alert';
import { formatQuery } from '@/utils/format';
import { useSelector } from 'react-redux';
import { 
    setQuery, 
    selectQuery,
    selectTeachers,
    loadTeachers
} from "@/features/user-slice";
import Pagination from '@/components/table/pagination';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    Edit,
    Trash,
    Save,
    CircleX
} from 'lucide-react'
import { Combobox } from '@/components/elements/combobox';
import { useAppDispatch } from '@/lib/store';
import { Topic, Lesson } from '@/utils/types'

const Page = () => {
    const breadcrumbsData = [
        { name: "System", path: "/system" },
        { name: "Lesson list", path: "main" },
    ];
    const form = useForm<z.infer<typeof lessonSchema>>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });
    const topicForm = useForm<z.infer<typeof topicSchema>>({
        resolver: zodResolver(topicSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });
    const teacherForm = useForm<z.infer<typeof lessonTeacherSchema>>({
        resolver: zodResolver(lessonTeacherSchema),
        defaultValues: {
            user_id: '',
        },
    });
    const dispatch = useAppDispatch();
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTopicListDialog, setTopicListDialog] = useState<boolean>(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [deletingLesson, setDeleteLesson] = useState<Lesson | null>(null);
    const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState<boolean>(false);
    const query = useSelector(selectQuery);
    const { data, error, isLoading } = useGetLessonsQuery(formatQuery(query));
    const [createLesson, createLessonResponse] = useCreateLessonMutation();
    const [updateLesson, updateLessonResponse] = useUpdateLessonMutation();
    const [deleteLesson] = useDeleteLessonMutation();
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const { data: topics, refetch: refetchTopics } = useGetTopicsQuery(selectedLessonId || '', {
        skip: !selectedLessonId,
    });
    const [createTopic] = useCreateTopicMutation();
    const [updateTopic] = useUpdateTopicMutation();
    const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<Topic>>({});
    const [deleteTopic] = useDeleteTopicMutation();
    const teachers = useSelector(selectTeachers);
    const { data: teachersList, refetch: refetchTeachers } = useGetLessonTeachersQuery(selectedLessonId || '', {
        skip: !selectedLessonId,
    });
    const [addTeacherToLesson] = useAddLessonTeacherMutation();
    const [removeTeacherFromLesson] = useRemoveLessonTeacherMutation();
    // const [localTeachers, setLocalTeachers] = useState(teachers);

    const isSubmitting = createLessonResponse.isLoading || updateLessonResponse.isLoading;
    const { toast } = useToast();

    const pagination = useMemo(() => {
        if (data?.pagination) return data.pagination;
        else return null;
    }, [data]);

    useEffect(() => {
        if(teachers.length === 0) dispatch(loadTeachers());
    }, [teachers, dispatch]);

    const handleExport = async () => {
        try {
            if (data?.lessons && data.lessons.length > 0) {
                const formattedData = data.lessons.map((lesson, index) => ({
                    index: index + 1, 
                    title: lesson.title,
                    description: lesson.description,
                    creator_name: `${lesson.creator.lastname} ${lesson.creator.firstname}`,
                    created_at: new Date(lesson.created_at).toLocaleDateString(), 
                }));
                
                const columns = [
                    { header: "No", key: "index", width: 10 },
                    { header: "Title", key: "title", width: 30 },
                    { header: "Description", key: "description", width: 50 },
                    { header: "Creator By", key: "creator_name", width: 20 },
                    { header: "Created At", key: "created_at", width: 15 },
                ];

                await ExcelHelper.generateAndDownloadExcel("lessons.xlsx", formattedData, columns);
    
                toast({
                    title: "Export Successful",
                    description: "The lessons data has been exported successfully.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "No Data",
                    description: "There is no data available for export.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: "An error occurred while exporting the data.",
            });
            console.log("Export Error:", error);
        }
    };       

    const onSubmit = async (values: z.infer<typeof lessonSchema>) => {
        try {
            if (isEditing && editingLesson) {
                const payload = { id: editingLesson.id, body: values };
                await updateLesson(payload).unwrap();
        
                toast({
                    title: "Success",
                    description: "Lesson updated successfully",
                });
        
                form.reset();
                setDialogOpen(false);
                setIsEditing(false);
                setEditingLesson(null);
            } else {
                await createLesson(values).unwrap();
        
                toast({
                    title: "Success",
                    description: "Lesson created successfully",
                });
        
                form.reset();
                setDialogOpen(false);
                setIsEditing(false);
                setEditingLesson(null);
            }
        } catch (err) {
            const error = err as {
                data?: {
                    message?: string;
                };
            };
    
            const message = error?.data?.message || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };

    const showTopic = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setTopicListDialog(true);
    };

    const onSubmitAddTopic = async (values: z.infer<typeof topicSchema>) => {
        try {
            if (selectedLessonId) {
                await createTopic({ lessonId: selectedLessonId, body: values }).unwrap();
                toast({
                    title: "Success",
                    description: "Topic created successfully",
                });
                topicForm.reset();
                refetchTopics();
            }
        } catch (err) {
            const error = err as {
                data?: {
                message?: string;
                };
            };
        
            const message = error?.data?.message || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };

    const handleEditClick = (topic: Topic) => {
        setEditingTopicId(topic.id || null);
        setEditValues({
            title: topic.title,
            description: topic.description,
        });
    };
    
    const handleSaveClick = async (id: string) => {
        console.log(editValues, id)
        try {
            await updateTopic({ id, body: editValues }).unwrap();
            toast({
                title: "Success",
                description: "Topic updated successfully",
            });
            setEditingTopicId(null);
            refetchTopics();
        } catch (err) {
            const error = err as {
                data?: {
                message?: string;
                };
            };
            const message = error?.data?.message || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };
    
    const handleCancelClick = () => {
        setEditingTopicId(null);
        setEditValues({});
    };
    
    const handleDeleteClick = async (id: string) => {
        try {
            await deleteTopic(id).unwrap();
            toast({
                title: "Success",
                description: "Topic deleted successfully",
            });
            refetchTopics();
        } catch (err) {
            const error = err as {
                data?: {
                message?: string;
                };
            };
            const message = error?.data?.message || "failed to delete topic";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };
    
    const handleInputChange = (field: keyof Topic, value: string) => {
        setEditValues((prev) => ({ ...prev, [field]: value }));
    };

    const editHandler = (lesson: Lesson) => {
        form.setValue('title', lesson.title);
        form.setValue('description', lesson.description);
        setDialogOpen(true);
        setIsEditing(true)
        setEditingLesson(lesson);
    };    
    
    const deleteHandler = (lessonId: string) => {
        if (lessonId) {
            setDeleteLesson({ id: lessonId } as Lesson);
            setAlertOpen(true);
        }
    };

    const handleConfirm = async () => {
        if (deletingLesson) {
            try {
                const res = await deleteLesson(deletingLesson.id);

                toast({
                    title: 'Lesson Deleted',
                    description: res?.data?.message,
                });
            } catch {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to delete lesson.',
                });
            } finally {
                setDeleteLesson(null)
                setAlertOpen(false);
            }
        }
    };

    const showTeachers = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setIsTeacherDialogOpen(true);
    };

    const handleAddTeacher = async (values: z.infer<typeof lessonTeacherSchema>) => {
        console.log(values)
        try {
            await addTeacherToLesson({
                lessonId: selectedLessonId!,
                userId: String(values.user_id),
            }).unwrap();
            toast({
                title: "Success",
                description: "Teacher added successfully",
            });
            refetchTeachers();
            teacherForm.reset();
        } catch (err) {
            const error = err as {
                data?: {
                message?: string;
                };
            };
            const message = error?.data?.message || "failed to add teacher";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };
    
    const handleRemoveTeacher = async (userId: string) => {
        try {
            await removeTeacherFromLesson({
                lessonId: selectedLessonId!,
                userId,
            }).unwrap();
    
            toast({
                title: "Success",
                description: "Teacher removed successfully",
            });
    
            // setLocalTeachers((prev) => prev.filter((teacher) => teacher.id !== userId));
    
            refetchTeachers();
        } catch (err) {
            const error = err as {
                data?: {
                message?: string;
                };
            };
            const message = error?.data?.message || "failed to remove teacher";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };
    

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

    const tableData = data?.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        created_by: lesson.created_by,
        created_at: lesson.created_at,
        creator: lesson.creator,
        topics: lesson.topics,
    })) || [];

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
                <SideHeader breadcrumbs={breadcrumbsData} />
            </div>

            <div className="flex-auto rounded-md max-h-full overflow-y-auto px-10">
                <Datatable
                    tableData={tableData}
                    columns={lessonColumns(editHandler, deleteHandler, showTopic, showTeachers)}
                    isLoading={isLoading}
                    error={!!error}
                    pagination={{
                        start: pagination?.start ?? 1,
                        pageSize: pagination?.limit ?? 25,
                    }}
                >
                    <div className="w-full flex justify-between">
                        <div>
                            <Button 
                                className="w-full bg-blue-400 hover:bg-blue-500"
                                onClick={() => {setDialogOpen(true)}}
                            >
                                Create lesson
                            </Button>
                        </div>
                        <div className="flex gap-x-2">
                            <Button className='w-full bg-green-500 hover:bg-green-600 px-10' onClick={() => handleExport()}>
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
                title={isEditing ? 'Хичээлийн бүртгэл засах' : 'Хичээлийн бүртгэл'}
                description="Хичээлийн нэр болон дэлгэрэнгүй тайлбарыг оруулна уу!"
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                    setEditingLesson(null)
                    setIsEditing(false)
                    form.reset();
                }}
            >
                <div className=''>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full" autoComplete='off'>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Хичээлийн нэр</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Хичээлийн нэр" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Хичээлийн тайлбар</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Хичээлийн тайлбар" {...field} className='h-20'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full pt-5 flex gap-x-5">
                                <Button type="submit" disabled={isSubmitting} className='w-full'>{isSubmitting ? 'Хадгалаж байна' : 'Хадгалах'}</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </MainDialog>

            {/* topic list */}
            <MainDialog
                title="Topic list"
                description="Add or change lesson's topics"
                isOpen={isTopicListDialog}
                onClose={() => {
                    setTopicListDialog(false)
                    topicForm.reset();
                }}
                className='w-full md:min-w-[800px]'
            >
                <div className='p-5 max-h-[500px] overflow-y-auto'>
                    <div className='flex justify-end mb-5'>
                        <Popover>
                            <PopoverTrigger className='px-2 py-1 rounded-md bg-blue-400 hover:bg-blue-500 text-gray-50'>Create topic</PopoverTrigger>
                            <PopoverContent>
                                <Form {...topicForm}>
                                    <form onSubmit={topicForm.handleSubmit(onSubmitAddTopic)} className="space-y-2 w-full" autoComplete='off'>
                                        <FormField
                                            control={topicForm.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 dark:text-gray-50">Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={topicForm.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 dark:text-gray-50">Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Description" {...field} className='h-20'/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="w-full pt-5">
                                            <Button type="submit" className='w-full'>Save Topic</Button>
                                        </div>
                                    </form>
                                </Form>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] border">№</TableHead>
                                <TableHead className=' border'>Title</TableHead>
                                <TableHead className=' border'>Description</TableHead>
                                <TableHead className="w-[100px] border">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topics?.map((topic, index) => (
                                <TableRow key={topic.id}>
                                    <TableCell className="font-medium border">{index + 1}</TableCell>
                                    <TableCell className="border">
                                        {editingTopicId === topic.id ? (
                                            <Input
                                                value={editValues.title || ""}
                                                onChange={(e) =>
                                                    handleInputChange("title", e.target.value)
                                                }
                                            />
                                        ) : (
                                            topic.title
                                        )}
                                    </TableCell>
                                    <TableCell className="border">
                                        {editingTopicId === topic.id ? (
                                            <Textarea
                                                value={editValues.description || ""}
                                                onChange={(e) =>
                                                    handleInputChange("description", e.target.value)
                                                }
                                            />
                                        ) : (
                                            topic.description
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right border">
                                        {editingTopicId === topic.id ? (
                                            <div className="flex space-x-2">
                                                <Button
                                                    className="bg-green-400 hover:bg-green-600"
                                                    onClick={() => handleSaveClick(topic.id!)}
                                                >
                                                    <Save/>
                                                </Button>
                                                <Button
                                                    className="bg-gray-400 hover:bg-gray-500"
                                                    onClick={handleCancelClick}
                                                >
                                                    <CircleX/>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Button
                                                    className="bg-blue-400 hover:bg-blue-600"
                                                    onClick={() => handleEditClick(topic)}
                                                >
                                                    <Edit/>
                                                </Button>
                                                <Button
                                                    className="bg-red-400 hover:bg-red-600"
                                                    onClick={() => handleDeleteClick(topic.id!)}
                                                >
                                                    <Trash/>
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </MainDialog>
           
            <MainDialog
                title="Manage Teachers"
                description="Add or remove teachers for the lesson"
                isOpen={isTeacherDialogOpen}
                onClose={() => {
                    setIsTeacherDialogOpen(false)
                    setSelectedLessonId(null);
                    teacherForm.reset()
                }}
            >
                <div className="space-y-4">
                    <Form {...teacherForm}>
                        <form onSubmit={teacherForm.handleSubmit(handleAddTeacher)} className="space-y-2">
                            <FormField
                                control={teacherForm.control}
                                name="user_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Teacher</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={teachers?.map((teacher) => ({
                                                    value: teacher.id,
                                                    label: teacher.firstname,
                                                })) || []}
                                                defaultValue={field.value as string}
                                                placeholder="Select a teacher"
                                                onChange={(value) => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Add Teacher</Button>
                        </form>
                    </Form>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>№</TableHead>
                                <TableHead>Teacher Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachersList?.map((teacher, index) => (
                                <TableRow key={teacher.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{`${teacher.firstname} ${teacher.lastname}`}</TableCell>
                                    <TableCell>{teacher.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            className="bg-red-400 hover:bg-red-600"
                                            onClick={() => handleRemoveTeacher(teacher.id)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </MainDialog>

            
            <AlerDialog
                title="Delete user"
                description="You are about to delete the user. Please note that it cannot be restored!"
                isOpen={isAlertOpen}
                onClose={() => setAlertOpen(false)}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default Page;
