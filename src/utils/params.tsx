const LIMIT = [25, 50, 75, 100];
const ROLE = {
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student'
}

const DURATION = [
    { time: 120, text: '2 min' },
    { time: 180, text: '3 min' },
    { time: 240, text: '4 min' },
    { time: 300, text: '5 min' },  
    { time: 600, text: '10 min' }, 
    { time: 900, text: '15 min' }, 
    { time: 1200, text: '20 min' },
    { time: 1800, text: '30 min' },
    { time: 2700, text: '45 min' } 
];


const QUIZ_NUMBER = [
    { number:10, value:'10 questions'},
    { number:15, value:'15 questions'},
    { number:20, value:'20 questions'},
    { number:25, value:'25 questions'},
    { number:30, value:'30 questions'},
    { number:35, value:'35 questions'},
    { number:40, value:'40 questions'},
    { number:45, value:'45 questions'}
]

const LEVEL = [
    "Basic",
    "Intermediate",
    "Advanced"
]

const ANSWERTYPE = [
    "True/False",
    "Multiple choice"
]

export {
    LIMIT,
    ROLE,
    DURATION,
    QUIZ_NUMBER,
    LEVEL,
    ANSWERTYPE
}