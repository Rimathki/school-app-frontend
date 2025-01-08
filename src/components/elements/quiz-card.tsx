import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; 
import { LEVEL } from '@/utils/params';

const QuizCard = ({  lesson, topic, duration, level, onButtonClick }: { 
    lesson?: string, 
    topic?: string, 
    buttonText?: string,
    duration?: string,
    level?: string,
    onButtonClick: () => void 
}) => {
    return (
        <Card className="w-80 bg-white shadow-md rounded-lg">
            <CardHeader className="p-0">
                <Image 
                src={'/question.jpg'} 
                alt={'quiz'} 
                width={320} 
                height={180} 
                className="rounded-t-lg object-cover" 
                />
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-xl font-bolder text-slate-600">Lesson: {lesson}</CardTitle>
                <CardDescription className="text-md text-gray-500 mt-2">Topic: {topic}</CardDescription>
                <CardDescription className="text-md text-gray-500 mt-2">Duration: {duration}sec</CardDescription>
                <CardDescription className="text-md text-gray-500 mt-2">Level: {LEVEL[Number(level)]}</CardDescription>
            </CardContent>
            <div className="p-4">
                <Button onClick={onButtonClick} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Start
                </Button>
            </div>
        </Card>
    );
};

export default QuizCard;
