'use client'

import React, { useEffect, useState } from 'react';
import SideHeader from '@/components/layouts/side-header';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/store';
import { useSelector } from 'react-redux';
import { loadQuizzes, selectQuizzes } from '@/features/lesson-slice';
import { Quiz } from '@/utils/types';
import { DURATION, LEVEL } from '@/utils/params';
import MainDialog from '@/components/elements/main-dialog';

const Page = () => {
  const params = useParams();
  const decodedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value).replace(/%20/g, ' ')])
  );

  const dispatch = useAppDispatch();
  const quizzes = useSelector(selectQuizzes);
  const topicId = params.topicId;

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    dispatch(loadQuizzes(String(topicId))); 
  }, [dispatch, topicId]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      setShowResults(true);
    }
  }, [isTimerRunning, timeLeft]);

  const handleAnswerClick = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedAnswers({});
    setIsDialogOpen(true);
    setTimeLeft(DURATION.find((item) => item.time === Number(quiz.duration))?.time || 0);
    setShowResults(false);
  };

  const startQuiz = () => {
    setIsTimerRunning(true);
  };

  const handleDoneClick = () => {
    setIsTimerRunning(false);
    setShowResults(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedQuiz(null);
    setIsTimerRunning(false);
    setShowResults(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <SideHeader
          breadcrumbs={[
            { name: capitalizeFirstLetter(decodedParams.lesson), path: 'main' },
            { name: capitalizeFirstLetter(decodedParams.topic), path: 'main' },
          ]}
        />
      </div>
      <div className="flex-auto p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className="p-4 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleQuizClick(quiz)}
            >
              <h2 className="text-lg font-bold mb-2 text-slate-600">Quiz #{index +1}</h2>
              <p className='text-slate-600'><strong>Lesson:</strong> {capitalizeFirstLetter(decodedParams.lesson)}</p>
              <p className='text-slate-600'><strong>Topic:</strong> {capitalizeFirstLetter(decodedParams.topic)}</p>
              <p className='text-slate-600'><strong>Level:</strong> {LEVEL[Number(quiz.level)]}</p>
              <p className='text-slate-600'><strong>Duration:</strong> {DURATION.find((item) => item.time === Number(quiz.duration))?.text || 'Unknown Duration'}</p>
            </div>
          ))}
        </div>

        {selectedQuiz && (
          <MainDialog
            title={`Quiz #${selectedQuiz.id}`}
            description="Answer the questions within the time limit."
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedQuiz(null);
              setIsTimerRunning(false);
              setShowResults(false);
            }}
            className='w-full md:max-w-[800px] p-5 max-h-[800px] overflow-y-auto'
          >
            {showResults ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Results</h2>
                <ul className="space-y-2">
                  {selectedQuiz.content?.map((question, index) => (
                    <li key={index}>
                      <p>
                        <strong>Q{index + 1}:</strong> {question.question}
                      </p>
                      <p>
                        <strong>Your Answer:</strong> {selectedAnswers[index] || 'No Answer'}
                      </p>
                      <p>
                        <strong>Correct Answer:</strong> {question.correct_answer}
                      </p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={closeDialog}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold mb-4">Time Left: {timeLeft} seconds</p>
                <button
                  onClick={startQuiz}
                  className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  disabled={isTimerRunning}
                >
                  Start Quiz
                </button>
                {isTimerRunning && (
                  <div className="space-y-4">
                    {selectedQuiz.content?.map((quiz, index) => (
                      <div key={index} className="border rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-semibold mb-3">{quiz.question}</h3>
                        <ul className="space-y-2">
                          {quiz.options.map((option: string, i: number) => (
                            <li
                              key={i}
                              onClick={() => handleAnswerClick(index, option)}
                              className={`cursor-pointer border rounded px-4 py-2 transition ${
                                selectedAnswers[index] === option
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 hover:bg-blue-200'
                              }`}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
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
              </div>
            )}
          </MainDialog>
        )}
      </div>
    </div>
  );
};

export default Page;

function capitalizeFirstLetter(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
