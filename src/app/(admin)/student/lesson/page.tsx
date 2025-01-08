'use client'

import Header from '@/components/layouts/header';
import { selectAuth } from '@/features/auth-slice';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import QuizCard from '@/components/elements/quiz-card';
import MainDialog from '@/components/elements/main-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Quiz } from '@/utils/types';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';

const Page = () => {
    const auth = useSelector(selectAuth);
    const quizzes = auth?.quizzes || [];
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | ''>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // To show remaining time
    const [timeTaken, setTimeTaken] = useState(0); // To show time taken once quiz is completed
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null); // Track the start time
    const [answers, setAnswers] = useState<string[]>([]); // To store the user's answers
    const [quizResults, setQuizResults] = useState<{ correct: number; wrong: number } | null>(null);

    const handleClick = (quizId: string) => {
        const quiz = quizzes.find((q) => q.id === quizId);
        if (quiz) {
            setSelectedQuiz(quiz);
            setIsDialogOpen(true);
            setTimeLeft(quiz.duration); // Set the duration for the timer
            setIsTimerRunning(false);  // Ensure timer is stopped when quiz is first opened
            setQuizResults(null); // Reset results when a new quiz is opened
            setAnswers([]); // Reset previous answers
            setTimeTaken(0); // Reset time taken
            setStartTime(null); // Reset start time
        }
    };

    const startQuiz = () => {
        setIsTimerRunning(true);
        setStartTime(Date.now()); // Record the start time when the quiz begins
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer); // Stop the timer when it reaches 0
                    calculateResults(); // Calculate results when time is up
                    setTimeTaken(Date.now() - (startTime || Date.now())); // Record time taken when the quiz ends
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Update every second
    };

    const handleAnswer = (questionIndex: number, selectedOption: string) => {
        setAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            newAnswers[questionIndex] = selectedOption; // Set the answer for the specific question
            return newAnswers;
        });
    };

    const calculateResults = () => {
        if (selectedQuiz) {
            const correctAnswers = selectedQuiz.content?.map((quiz, index) => {
                return answers[index] === quiz.correct_answer;
            });

            const correct = correctAnswers?.filter((isCorrect) => isCorrect).length || 0;
            const wrong = (selectedQuiz.content?.length || 0) - correct;

            setQuizResults({ correct, wrong });
        }
    };

    const handleDoneClick = () => {
        setIsTimerRunning(false);
        setTimeTaken(Date.now() - (startTime || Date.now())); // Record time taken when the user clicks "Done"
        calculateResults(); // Calculate results when the user clicks "Done"
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedQuiz('');
        setIsTimerRunning(false);
        setTimeLeft(0); // Reset time left when closing the dialog
        setQuizResults(null); // Reset the results
        setAnswers([]); // Clear answers when closing
        setTimeTaken(0); // Reset time taken
    };

    return (
        <div>
            <Header />
            <div className="relative h-[400px] bg-gradient-to-tr from-blue-400 via-blue-500 to-teal-400">
                <div className="flex flex-col gap-4 justify-center items-center w-full h-full px-3 md:px-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase">
                        Your lessons
                    </h1>
                    <p className="text-gray-50 text-lg">
                        Student: {auth?.firstname}
                    </p>
                </div>
            </div>
            <div className='my-20 max-w-6xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {quizzes?.length > 0 ? (
                        quizzes.map((quiz) => (
                            <QuizCard
                                key={quiz.id}
                                lesson={quiz?.topic?.lesson?.title}
                                topic={quiz?.topic?.title}
                                buttonText="Start Quiz"
                                duration={quiz.duration.toString()}
                                level={quiz.level}
                                onButtonClick={() => handleClick(quiz.id)}
                            />
                        ))
                    ) : (
                        <p>No quizzes available.</p>
                    )}
                </div>
            </div>

            {selectedQuiz && (
                <MainDialog
                    title={`Quiz: ${selectedQuiz.topic?.title}`}
                    description="Answer the questions within the time limit."
                    isOpen={isDialogOpen}
                    onClose={closeDialog}
                    className='w-full md:max-w-[900px] p-5 max-h-[900px] overflow-y-auto'
                >
                    <div>
                        <p className="text-lg font-semibold mb-4">
                            {isTimerRunning
                                ? `Time Left: ${timeLeft} seconds remaining`
                                : timeTaken > 0
                                ? `Time Taken: ${Math.floor(timeTaken / 1000)} seconds`
                                : 'Start the quiz to begin the timer'
                            }
                        </p>
                        {!isTimerRunning && !quizResults && (
                            <button
                                onClick={startQuiz}
                                className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                disabled={isTimerRunning}
                            >
                                Start Quiz
                            </button>
                        )}
                        {isTimerRunning && (
                            <div className="space-y-4">
                                {selectedQuiz.content?.map((quiz, index) => (
                                    <div key={index} className="border rounded-lg p-4 shadow-md">
                                        <h3 className="text-lg font-semibold mb-3">{quiz.question}</h3>
                                        <div className="space-y-2">
                                            {quiz.options.map((option: string, i: number) => (
                                                <div key={i} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={answers[index] === option}
                                                        onCheckedChange={() => handleAnswer(index, option)}
                                                    />
                                                    <label>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={handleDoneClick}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                        {quizResults && (
                            <div className="mt-4">
                                <p className='text-slate-600'>Your result is</p>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Correct Answers:</TableCell>
                                            <TableCell>{quizResults.correct}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Wrong Answers:</TableCell>
                                            <TableCell>{quizResults.wrong}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Time Taken:</TableCell>
                                            <TableCell>{Math.floor(timeTaken / 1000)} seconds</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <div className='mt-5 flex justify-center items-center w-full'>
                                    <Button className='bg-blue-400 hover:bg-blue-500 px-5' onClick={() => {setIsDialogOpen(false), closeDialog}}>Close</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </MainDialog>
            )}
        </div>
    );
};

export default Page;
