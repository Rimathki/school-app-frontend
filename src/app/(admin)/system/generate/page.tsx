"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useAppDispatch } from "@/lib/store";
import { 
    loadLessons, 
    loadTopics, 
    selectLessons, 
    selectTopics 
} from "@/features/lesson-slice";
import SideHeader from "@/components/layouts/side-header";
import { pdfGenerateSchema } from '@/utils/validation'
import FileInput from "@/components/elements/file-input";
import { useToast } from "@/hooks/use-toast";
import { generateQuiz } from "@/api/openai";
import { DURATION, LEVEL, QUIZ_NUMBER, ANSWERTYPE } from "@/utils/params";
import { useSaveQuizMutation } from "@/api/lesson";
import { QuizContent } from "@/utils/types";

const Page = () => {
    const { toast } = useToast()
    const dispatch = useAppDispatch();
    const lessons = useSelector(selectLessons);
    const topics = useSelector(selectTopics);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratedQuiz, setGeneratedQuiz] = useState<QuizContent[]>([])
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [saveQuiz, { isLoading: isSaving }] = useSaveQuizMutation();

    const form = useForm<z.infer<typeof pdfGenerateSchema>>({
        resolver: zodResolver(pdfGenerateSchema),
        defaultValues: {
            lesson: "",
            topic: "",
            time: "",
            number: "",
            level: "",
            file: undefined,
        },
    });

    const selectedLesson = form.watch("lesson");

    useEffect(() => {
        if (lessons.length === 0) {
            dispatch(loadLessons());
        }
    }, [lessons, dispatch]);

    useEffect(() => {
        if (selectedLesson) {
            const selectedLessonId = lessons.find((lesson) => lesson.title === selectedLesson)?.id;
            if (selectedLessonId) {
                dispatch(loadTopics(selectedLessonId));
            }
        }
    }, [selectedLesson, lessons, dispatch]);

    const onSubmit = async (data: z.infer<typeof pdfGenerateSchema>) => {
        setIsLoading(true);
        
        try {
            const file = data.file;
            const topic = data.topic;
            const lesson = data.lesson;
            const quizTime = data.time;
            const quizNumber = data.number;
            const level = data.level;
            const answer_type = data.answer_type;

            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target?.result as string;

                const quiz = await generateQuiz(fileContent, topic, lesson, quizTime, quizNumber, level, answer_type);
                console.log(quiz);
                if (quiz?.questions) {
                    console.log('Generated Quiz:', quiz.questions);
                    setGeneratedQuiz(quiz?.questions);
                    toast({
                        title: "Quiz Generated Successfully",
                        description: "Check the console for quiz questions.",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to generate quiz. Please check the input and try again.",
                        variant: "destructive",
                    });
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to generate quiz. Please try again. ${error}`,
                variant: "destructive",
            });
        } finally {
            
        }
    };

    console.log(isLoading, isSaving);

    const handleAnswerClick = (questionIndex: number, answer: string) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSaveQuiz = async () => {
        const topic = topics.find((t) => t.title === form.getValues("topic"));
        if (!topic) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a valid topic before saving.",
            });
            return;
        }
    
        const duration = parseInt(form.getValues("time"), 10);
        const level = parseInt(form.getValues("level"), 10);
    
        try {
            const response = await saveQuiz({
                topicId: topic.id,
                duration,
                level,
                content: isGeneratedQuiz.map((quiz) => ({
                    question: quiz.question,
                    options: quiz.options,
                    correct_answer: quiz.correct_answer,
                })),
            }).unwrap();
    
            if (response.success) {
                setGeneratedQuiz([])
                toast({
                    title: "Success",
                    description: response.message,
                });
            }
        } catch (error) {
            console.log("Error saving quiz:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save quiz. Please try again.",
            });
        }
    };
    
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
                <SideHeader breadcrumbs={[{ name: 'System', path: '/system' }, { name: 'Generate quiz', path: 'main' }]} />
            </div>
            <div className="flex-1">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="border md:min-w-[300px] md:w-full"
                >
                    <ResizablePanel>
                        <div className="px-10">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                                    <FormField
                                        control={form.control}
                                        name="answer_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Exam type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Answer type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {ANSWERTYPE.map((option, index) => (
                                                            <SelectItem key={index} value={option}>
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lesson"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lesson</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a lesson" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {lessons.map((lesson, index) => (
                                                            <SelectItem key={index} value={lesson.title}>
                                                                {lesson.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="topic"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Topic</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a topic" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {topics.map((topic, index) => (
                                                            <SelectItem key={index} value={topic.title}>
                                                                {topic.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of questions</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a number of quiz" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {QUIZ_NUMBER.map((number, index) => (
                                                                <SelectItem key={index} value={String(number.number)}>
                                                                    {number.value}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />

                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duration</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a topic" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {DURATION.map((time, index) => (
                                                                <SelectItem key={index} value={String(time.time)}>
                                                                    {time.text}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />

                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Difficulty level</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a level" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {LEVEL.map((level, index) => (
                                                                <SelectItem key={index} value={String(index)}>
                                                                    {level}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />

                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({ }) => (
                                            <FormItem>
                                                <FormLabel>Upload File</FormLabel>
                                                <FormControl>
                                                    <FileInput
                                                        name="file"
                                                        label=""
                                                        control={form.control}
                                                        accept={{ "application/pdf": [".pdf"] }}
                                                        maxSize={4 * 1024 * 1024}
                                                        multiple={false}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="w-full px-20">
                                        <Button type="submit" disabled={isLoading} className="w-full">
                                            {isLoading ? "Generating..." : "Generate"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel>
                        <div className="min-h-[95%] max-h-[95%] flex flex-col">
                            <div className="flex-1 overflow-hidden overflow-y-auto">
                                <div className="px-6 py-5 space-y-6 min-h-[90%] max-h-[80%]">
                                    {isGeneratedQuiz.length > 0 ? (
                                        isGeneratedQuiz.map((quiz, index) => (
                                            <div key={index} className="border rounded-lg p-4 shadow-md">
                                                <h3 className="text-lg font-semibold mb-3">{quiz.question}</h3>
                                                <ul className="space-y-2">
                                                    {quiz.options.map((option: string, i: number) => (
                                                        <li
                                                            key={i}
                                                            onClick={() => handleAnswerClick(index, option)}
                                                            className={`cursor-pointer border rounded px-4 py-2 transition ${
                                                                selectedAnswers[index] === option
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-gray-100 hover:bg-blue-200"
                                                            }`}
                                                        >
                                                            {option}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center">No quizzes generated yet.</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center mt-5">
                                {isGeneratedQuiz.length > 0 && (
                                    <Button onClick={handleSaveQuiz} disabled={isSaving}>
                                        {isSaving ? "Saving questions..." : "Save questions"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default Page;