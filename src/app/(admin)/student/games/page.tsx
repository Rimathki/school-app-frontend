'use client'

import Header from '@/components/layouts/header';
import { selectAuth } from '@/features/auth-slice';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import QuizCard from '@/components/elements/quiz-card';
import MainDialog from '@/components/elements/main-dialog';
import { Button } from '@/components/ui/button';
import { ConfidenceResult, Quiz } from '@/utils/types';
import { Circle, ChevronUp } from 'lucide-react';

const Page = () => {
    const auth = useSelector(selectAuth);
    const quizzes = auth?.quizzes || [];
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [confidence, setConfidence] = useState(0);
    const [quizResults, setQuizResults] = useState<ConfidenceResult | null>(null);
    const [selectedConfidence, setSelectedConfidence] = useState<number>(0);

    const [quizConfidences, setQuizConfidences] = useState<Record<number, number>>({});

    const handleConfidenceSelect = (level: number) => {
        setSelectedConfidence(level);
        setConfidence(level * 20);
        setQuizConfidences(prev => ({
            ...prev,
            [currentQuestionIndex]: level
        }));
    };

    const calculateConfidenceResults = () => {
        const confidences = Object.values(quizConfidences);
        if (confidences.length === 0) return null;
    
        const counts = confidences.reduce((acc, level) => {
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);
    
        const total = confidences.length;
        const sum = confidences.reduce((acc, val) => acc + val, 0);
        const average = sum / total;
    
        return {
            average,
            counts,
            total
        };
    };
    
    const confidenceLevels = [
        { level: 1, color: 'text-red-500', label: 'Not at all' },
        { level: 2, color: 'text-orange-500', label: 'Slightly' },
        { level: 3, color: 'text-yellow-500', label: 'Moderately' },
        { level: 4, color: 'text-lime-500', label: 'Very well' },
        { level: 5, color: 'text-green-500', label: 'Perfectly' },
    ];

    const getConfidenceColor = (level: number) => {
        const colors = {
            1: 'bg-red-500',
            2: 'bg-orange-500',
            3: 'bg-yellow-500',
            4: 'bg-lime-500',
            5: 'bg-green-500'
        };
        return colors[level as keyof typeof colors] || 'bg-gray-200';
    };

    const handleClick = (quizId: string) => {
        const quiz = quizzes.find((q) => q.id === quizId);
        if (quiz) {
            setSelectedQuiz(quiz);
            setCurrentQuestionIndex(0);
            setIsAnswerRevealed(false);
        }
    };

    const handleTopicClick = (topicTitle: string) => {
        setSelectedTopic(topicTitle);
    };

    const filteredQuizzes = selectedTopic
        ? quizzes.filter((quiz) => quiz.topic?.title === selectedTopic)
        : quizzes;

    const handleRevealAnswer = () => {
        setIsAnswerRevealed(true);
    };

    const handleNextQuestion = () => {
        if (selectedQuiz?.content && currentQuestionIndex < selectedQuiz.content.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswerRevealed(false);
            setSelectedConfidence(0);
        }
    };

    const closeDialog = () => {
        setSelectedQuiz(null);
        setCurrentQuestionIndex(0);
        setSelectedConfidence(0);
        setIsAnswerRevealed(false);
        setQuizConfidences({});
    };

    const isLastQuestion = selectedQuiz?.content && 
        currentQuestionIndex === selectedQuiz.content.length - 1;

    return (
        <div>
            <Header />
            <div className='my-20 max-w-6xl mx-auto'>
                <div className='grid grid-cols-4 gap-5'>
                    <div className='col-span-1 bg-gray-50 shadow-md'>
                        <div className='p-5'>
                            <ul>
                                {auth?.teachers?.map((teacher) => (
                                    <li key={teacher.id}>
                                        <ul className='py-3'>
                                            {teacher.lessons?.map((lesson, idx) => (
                                                <li key={idx}>
                                                    <p className='text-lg font-bolder'>{lesson.title}</p>
                                                    {lesson.topic?.map((topic) => (
                                                        <div key={topic.id} className='mx-4 text-slate-700'>
                                                            <div 
                                                                onClick={() => handleTopicClick(topic.title)}
                                                                className="cursor-pointer hover:text-blue-500 flex items-center gap-2 py-2"
                                                            >
                                                                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                                                                    {quizzes.filter(q => q.topic?.title === topic.title).length}
                                                                </span>
                                                                <h2>{topic.title}</h2>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='col-span-3'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                            {filteredQuizzes?.length > 0 ? (
                                filteredQuizzes.map((quiz) => (
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
                </div>
            </div>

            {selectedQuiz && (
                <MainDialog
                    title={`Quiz: ${selectedQuiz.topic?.title}`}
                    isOpen={!!selectedQuiz}
                    description=''
                    onClose={closeDialog}
                    className='max-w-full p-5 h-full'
                >
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-5 '>
                        <div className='col-span-1'>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-4">Quiz Progress</h3>
                                <div className="flex flex-col gap-4">
                                    {selectedQuiz?.content?.map((_, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div 
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                                                    ${quizConfidences[index] 
                                                        ? getConfidenceColor(quizConfidences[index])
                                                        : 'bg-gray-200'
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-300 ${
                                                        quizConfidences[index] 
                                                            ? getConfidenceColor(quizConfidences[index])
                                                            : ''
                                                    }`}
                                                    style={{ 
                                                        width: quizConfidences[index] 
                                                            ? `${quizConfidences[index] * 20}%` 
                                                            : '0%' 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Not at all</span>
                                        <span>Perfectly</span>
                                    </div>
                                    <div className="relative">
                                        <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mt-1" />
                                        {/* Confidence Arrow Indicator */}
                                        <div 
                                            className="absolute -top-2 transition-all duration-300"
                                            style={{ 
                                                left: `${selectedConfidence ? (selectedConfidence - 1) * 25 : 0}%`,
                                                transform: 'translateX(-50%)'
                                            }}
                                        >
                                            <ChevronUp 
                                                className="w-4 h-4 text-gray-700" 
                                                strokeWidth={3}
                                            />
                                        </div>
                                        {/* Confidence Level Markers */}
                                        <div className="flex justify-between px-[2%] mt-2">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div 
                                                    key={level}
                                                    className={`h-1 w-1 rounded-full ${
                                                        selectedConfidence >= level 
                                                            ? 'bg-gray-700' 
                                                            : 'bg-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-3 mx-10 h-screen'>
                            <div className="bg-gray-50 p-8 rounded-lg h-full flex flex-col">
                                <div className="flex gap-2">
                                    {selectedQuiz.content?.map((_: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                                                ${index === currentQuestionIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => {
                                                setCurrentQuestionIndex(index);
                                                setIsAnswerRevealed(false);
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-semibold mb-8 text-center max-w-2xl">
                                        {selectedQuiz.content && selectedQuiz.content[currentQuestionIndex]?.question}
                                    </h2>
                                    
                                    {isAnswerRevealed ? (
                                        <div className="space-y-8 w-full max-w-2xl">
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <p className="font-semibold text-green-700 text-center">
                                                    Correct Answer: {selectedQuiz.content && 
                                                        selectedQuiz.content[currentQuestionIndex]?.correct_answer}
                                                </p>
                                            </div>
                                            
                                            <div className="mt-8">
                                                <p className="text-sm text-gray-600 mb-4 text-center">How well did you know this?</p>
                                                <div className="flex gap-8 justify-center">
                                                    {confidenceLevels.map(({ level, color, label }) => (
                                                        <div 
                                                            key={level}
                                                            className="flex flex-col items-center gap-2 cursor-pointer"
                                                            onClick={() => handleConfidenceSelect(level)}
                                                        >
                                                            <Circle 
                                                                className={`w-10 h-10 ${color} cursor-pointer transition-all duration-200 ${
                                                                    selectedConfidence === level 
                                                                        ? 'fill-current scale-110' 
                                                                        : 'fill-none hover:scale-105'
                                                                }`}
                                                            />
                                                            <span className="text-sm text-gray-600">{label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='border-t border-gray-200 w-full mt-8 pt-8 flex justify-center'>
                                            <Button 
                                                onClick={handleRevealAnswer}
                                                className="px-10 max-w-md py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg"
                                            >
                                                REVEAL ANSWER
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {isAnswerRevealed && (
                                    <div className="flex justify-end mt-8 mb-20">
                                        {isLastQuestion ? (
                                            <div className="text-center w-full">
                                                {selectedConfidence === 0 ? (
                                                    <div className="space-y-8 w-full max-w-2xl mx-auto">
                                                        <p className="text-sm text-gray-600 mb-4 text-center">
                                                            Please select your confidence level for the last question
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center w-full">
                                                        <p className="text-xl font-semibold text-gray-700 mb-4">
                                                            Quiz Completed! 🎉
                                                        </p>
                                                        
                                                        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-6">
                                                            <h3 className="text-lg font-semibold mb-4">Confidence Summary</h3>
                                                            
                                                            {/* Average Confidence */}
                                                            <div className="mb-6">
                                                                <p className="text-sm text-gray-600 mb-2">Average Confidence</p>
                                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div 
                                                                        className="h-full bg-blue-500"
                                                                        style={{ 
                                                                            width: `${(calculateConfidenceResults()?.average || 0) * 20}%` 
                                                                        }}
                                                                    />
                                                                </div>
                                                                <p className="text-right text-sm text-gray-600 mt-1">
                                                                    {((calculateConfidenceResults()?.average || 0) * 20).toFixed(1)}%
                                                                </p>
                                                            </div>

                                                            {/* Confidence Distribution */}
                                                            <div className="space-y-3">
                                                                {confidenceLevels.map(({ level, color, label }) => {
                                                                    const count = calculateConfidenceResults()?.counts[level] || 0;
                                                                    const percentage = (count / (calculateConfidenceResults()?.total || 1)) * 100;
                                                                    
                                                                    return (
                                                                        <div key={level} className="flex items-center gap-2">
                                                                            <Circle className={`w-6 h-6 ${color} ${count > 0 ? 'fill-current' : ''}`} />
                                                                            <div className="flex-1">
                                                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                                    <div 
                                                                                        className={`h-full ${color.replace('text-', 'bg-')}`}
                                                                                        style={{ width: `${percentage}%` }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <span className="text-sm text-gray-600 w-16 text-right">
                                                                                {count} ({percentage.toFixed(0)}%)
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        <Button 
                                                            onClick={closeDialog}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white"
                                                        >
                                                            Finish Quiz
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Button 
                                                onClick={handleNextQuestion}
                                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                                disabled={!selectedConfidence}
                                            >
                                                Next Question
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </MainDialog>
            )}
        </div>
    );
};

export default Page;