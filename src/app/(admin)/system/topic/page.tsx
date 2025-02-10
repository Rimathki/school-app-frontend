'use client'
import SideHeader from '@/components/layouts/side-header'
import React, { useEffect, useState } from 'react'
import { useCreateTopicMutation, useGetAllTopicsQuery } from '@/api/lesson'
import Datatable from '@/components/table/datatable'
import { topicColumns } from '@/components/table/columns'
import { Button } from '@/components/ui/button'
import MainDialog from '@/components/elements/main-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addTopicSchema } from '@/utils/validation'
import { useSelector } from 'react-redux'
import { loadLessons, selectLessons } from '@/features/lesson-slice'
import { useAppDispatch } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Page = () => {
    const form = useForm<z.infer<typeof addTopicSchema>>({
        resolver: zodResolver(addTopicSchema),
        defaultValues: {
            title: "",
            description: "",
            lesson_id: "",
        },
    });
    const { data: topics = [], error, isLoading } = useGetAllTopicsQuery()
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const lessons = useSelector(selectLessons)
    const [createTopic] = useCreateTopicMutation();
    const {toast} = useToast();
    console.log(lessons)

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadLessons())
    }, [dispatch])

    const editTopic = (id: string) => {
        console.log(id)
    }

    const onSubmit = async(values: z.infer<typeof addTopicSchema>) => {
        console.log(values)
        try {
            if (values) {
                await createTopic({ lessonId: values.lesson_id, body: values }).unwrap();
                toast({
                    title: "Success",
                    description: "Topic created successfully",
                });
                form.reset();
                setDialogOpen(false);
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
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
                <SideHeader breadcrumbs={[{ name: 'System', path: '/system' }, { name: 'Topic', path: 'main' }]} />
            </div>
            <div className="flex-auto rounded-md max-h-full overflow-y-auto px-10">
                <Datatable
                    tableData={topics}
                    columns={topicColumns(editTopic)}
                    isLoading={isLoading}
                    error={!!error}
                >
                    <div className="w-full flex justify-between">
                        <div>
                            <Button 
                                className="w-full bg-blue-400 hover:bg-blue-500"
                                onClick={() => {setDialogOpen(true)}}
                            >
                                Create topic
                            </Button>
                        </div>
                        <div className="flex gap-x-2">
                            <Button className='w-full bg-green-500 hover:bg-green-600 px-10'>
                                Export
                            </Button>
                        </div>
                    </div>
                </Datatable>
            </div>
            <MainDialog
                title={isEditing ? 'Topic edit' : 'Topic add'}
                description=""
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false)
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
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Topic name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="title" {...field} />
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
                                        <FormLabel className="text-slate-700 dark:text-gray-50">Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description" {...field} className='h-20'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lesson_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lessons</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a lesson" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {lessons.map((lesson, index) => (
                                                        <SelectItem key={index} value={String(lesson.id)}>
                                                            {lesson.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />
                            <div className="w-full pt-5 flex gap-x-5">
                                <Button type="submit" className='w-full'>{'Save data'}</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </MainDialog>
        </div>
    )
}

export default Page

function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}
