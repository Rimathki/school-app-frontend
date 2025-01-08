'use server';

import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { LEVEL } from '@/utils/params';

export const generateQuiz = async (filePath: string, topic: string, lesson: string, quizTime: string, quizNumber: string, level: string, answer_type: string) => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    try {
        const quizLevel = LEVEL[Number(level)]
        const absoluteFilePath = path.resolve(filePath);
        if (!fs.existsSync(absoluteFilePath)) {
            throw new Error(`File not found: ${absoluteFilePath}`);
        }

        const dataBuffer = fs.readFileSync(absoluteFilePath);
        const pdfData = await pdf(dataBuffer);
        const pdfText = pdfData.text;
        console.log(answer_type)
        const prompt = `
            Generate a multiple-choice quiz based on the following content. Requirements:
            - Create question answer type is ${answer_type}
            - Create ${quizNumber ? quizNumber : '10'} que  stions
            - Each question should have ${answer_type === 'Yes/No' ? '2 options: "Yes" and "No"' : '4 options'}
            - Clearly mark the correct answer
            - Ensure questions test comprehensive understanding
            - The quiz should be of difficulty (${quizLevel}).
            - The quiz is related to the lesson and topic: ${lesson} - ${topic}
            - The quiz duration should be around ${quizTime} minutes.
            - Respond in JSON format with a 'questions' array.

            Content:
            ${pdfText}
        `;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant for generating quizzes.' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 1500,
            }),
        });

        const responseData = await response.json();

        if (responseData.error) {
            throw new Error(responseData.error.message);
        }

        const content = responseData.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No content returned from API.');
        }
        const cleanedContent = content.replace(/```json|```/g, '').trim();

        const quiz = JSON.parse(cleanedContent);

        return quiz;
    } catch (error) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
    }
};
