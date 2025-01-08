const LIMIT = [25, 50, 75, 100];
const ROLE = {
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student'
}

const DURATION = [
    { time:30, text:'30 sec'},
    { time:60, text:'1 min'},
    { time:90, text:'1 min 30 sec'},
    { time:120, text:'2 min'},
    { time:150, text:'2 min 30 sec'},
    { time:180, text:'3 min'},
    { time:210, text:'3 min 30 sec'},
    { time:240, text:'4 min'}
]

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
    "Basic recall questions",
    "Application-level questions",
    "Advanced critical thinking questions"
]

const ANSWERTYPE = [
    "Yes/No",
    "Four answer"
]

export {
    LIMIT,
    ROLE,
    DURATION,
    QUIZ_NUMBER,
    LEVEL,
    ANSWERTYPE
}