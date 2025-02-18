'use client'

import React, { useCallback, useMemo, useState } from 'react';
import SideHeader from '@/components/layouts/side-header';
import { useGetAllQuizzesQuery, useUpdateQuizMutation } from '@/api/lesson';
import { formatQuery } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, selectQuery } from '@/features/user-slice';
import Datatable from '@/components/table/datatable';
import { quizColumns } from '@/components/table/columns';
import Pagination from '@/components/table/pagination';
import { Quiz } from '@/utils/types';
import MainDialog from '@/components/elements/main-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define the content schema
const contentSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correct_answer: z.string()
  }))
});

const Page = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const query = useSelector(selectQuery);
    const { data, error, isLoading } = useGetAllQuizzesQuery();
    const [updateContent, updateContentResponse] = useUpdateQuizMutation();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz>();
    const isSubmitting = updateContentResponse.isLoading;

    console.log(data);
    // Initialize form with the content schema
    const form = useForm<z.infer<typeof contentSchema>>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            questions: []
        },
    });

    const tableData = data?.quizzes.map((quiz) => ({
        id: quiz.id,
        level: quiz.level,
        topic: quiz.topic?.title,
        topic_id: quiz.topic_id,
        duration: quiz.duration,
    })) || [];

    const pagination = useMemo(() => {
        if (data?.pagination) return data.pagination;
        else return null;
    }, [data]);

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

    const editQuestionAnswer = (quizId: string) => {
        const quiz = data?.quizzes.find((quiz) => quiz.id === quizId);
        if (quiz) {
            setSelectedQuiz(quiz);
            // Set form default values based on selected quiz content
            form.reset({
                questions: quiz.content?.map(q => ({
                    question: q.question || '',
                    options: q.options || [],
                    correct_answer: q.correct_answer || ''
                }))
            });
            setDialogOpen(true);
        }
    };

    const onSubmit = async (values: z.infer<typeof contentSchema>) => {
        try {
            if (selectedQuiz) {
                await updateContent({
                    id: selectedQuiz.id,
                    body: {
                        content: values.questions
                    }
                }).unwrap();
                toast({
                    title: "Success",
                    description: "Changed quiz content",
                });
                setDialogOpen(false);
            }
        } catch (error) {
            toast({
                title: "Failed",
                description: "Change quiz content",
            });
            console.log('Failed to update quiz:', error);
        } finally {
            setDialogOpen(false);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
                <SideHeader breadcrumbs={[{ name: 'System', path: '/system' }, { name: 'Quiz list', path: 'main' }]} />
            </div>
            <div className="flex-auto rounded-md max-h-full overflow-y-auto px-10">
                <Datatable
                    tableData={tableData}
                    columns={quizColumns(editQuestionAnswer)}
                    isLoading={isLoading}
                    error={!!error}
                    pagination={{
                        start: pagination?.start ?? 1,
                        pageSize: pagination?.limit ?? 25,
                    }}
                />
            </div>
            <div className="grow-0 shrink basis-1 px-5 lg:px-10 flex justify-between w-full">            
                {pagination !== null && pagination?.total > 4 && (
                    <Pagination pagination={pagination} select={handlePage} handleChangeLimit={handleLimitChange}/>
                )}
            </div>
            <MainDialog
                title="Edit quiz content"
                description=""
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    form.reset();
                }}
                className='max-w-full h-full overflow-y-auto'
            >
                <div className=''>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full w-full space-y-2" autoComplete="off">
                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[800px] px-10">
                                    {selectedQuiz?.content?.map((question, qIndex) => (
                                        <div key={qIndex} className="border-b pb-4">
                                            <h1>Question {qIndex + 1}</h1>
                                            <div className="px-5">
                                                <FormField
                                                    control={form.control}
                                                    name={`questions.${qIndex}.question`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-slate-700 dark:text-gray-50">Question</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Question" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <p className="text-sm pt-3 text-slate-600">Options</p>
                                                {question.options.map((option, optIndex) => (
                                                    <FormField
                                                        key={optIndex}
                                                        control={form.control}
                                                        name={`questions.${qIndex}.options.${optIndex}`}
                                                        render={({ field }) => (
                                                            <FormItem className="py-2">
                                                                <FormControl>
                                                                    <Input {...field} placeholder="Option" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                                <FormField
                                                    control={form.control}
                                                    name={`questions.${qIndex}.correct_answer`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-slate-700 dark:text-gray-50">Correct answer</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Correct answer" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full pb-5 flex justify-center gap-x-5">
                                <Button type="submit" disabled={isSubmitting} className="py-5 ">
                                    {isSubmitting ? 'Saving changes' : 'Save changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </MainDialog>
        </div>
    );
};

export default Page;