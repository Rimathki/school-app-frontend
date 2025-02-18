// types.ts
export interface Role {
    id: string;
    name: string;
    description?: string;
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    lessonId: string;
    lesson?: Lesson;
}

export interface Creator {
    id: string;
    lastname: string;
    firstname: string;
    email: string;
}

export interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password?: string;
    role?: Role;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    created_at: Date;
    created_by: string;
    topics: Topic[];
    topic?: Topic[];
    creator: Creator;
}

export interface Teachers {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role?: Role;
    lessons?: Lesson[];
    students?: Students[];
}

export interface Students {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role?: Role;
}

export interface Pagination {
    pageCount: number;
    page: number;
    total: number;
    start: number;
    end: number;
    limit: number;
    prevPage?: number;
    nextPage?: number;
}

export interface UserResponse {
    user: User;
    success: boolean;
    message: string;
}

export interface UsersResponse {
    users: User[];
    total: number;
    pagination: Pagination;
}

export interface LessonsResponse {
    lessons: Lesson[];
    total: number;
    pagination: Pagination;
}

export interface LessonResponse {
    lesson: Lesson;
    success: boolean;
    message: string;
}

export interface TeachersResponse {
    teachers: Teachers[];
    total: number;
    pagination: Pagination;
}

export interface TeacherWithStudentsResponse {
    success: boolean;
    teacher: {
      id: number;
      firstname: string;
      lastname: string;
      email: string;
      students: User[];
    };
  }
  

export interface StudentsResponse {
    students: Students[];
    total: number;
    pagination: Pagination;
}

export interface SuccessResponse {
    success: boolean;
    message: string;
}

export interface QuizContent {
    question: string;
    options: string[];
    correct_answer: string;
}

export interface Quiz {
    id: string;
    topic_id?: string;
    duration: number;
    level: string;
    content?: QuizContent[];
    topics?: Topic;
    topic?: Topic;
    created_at?: Date;
    updated_at?: Date;
}

export interface QuizzesResponse {
    quizzes: Quiz[];
    total: number;
    pagination: Pagination;
}

export interface QuizResponse {
    quiz: Quiz;
    success: boolean;
    message: string;
}

export interface AssignRolePayload {
    userId: string;
    roleId: string;
}

export interface ConfidenceResult {
    average: number;
    counts: Record<number, number>;
    total: number;
}
