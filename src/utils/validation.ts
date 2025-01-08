import { z } from "zod";

export const passwordSchema = z
    .object({
        password: z.string().min(8, { message: "The password must be at least 8 characters." }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Password does not match."
    });

export const loginSchema = z.object({
    username: z.string().min(2, { message: "Please fill in the username field!" }),
    password: z.string().min(8, { message: "The password must be at least 8 characters." }),
});

export const verifySchema = z.object({
    code: z.string().min(6, {
        message: "Enter the code sent by email!",
    }),
});

export const userSchema = z.object({
    username: z.string().min(2, { message: "Please fill in the username field!" }),
    firstname: z.string().min(2, { message: "Please fill in the lastname field!" }),
    lastname: z.string().min(2, { message: "Please fill in the firstname field!" }),
    email: z.string().email({ message: "Please enter a valid email address!" }),
    phone: z.string().min(8, { message: "The phone number must be at least 8 digits long." }).refine((val) => !isNaN(Number(val)), { message: "The phone number must be numbers only." }),
});

export const userAddInfoSchema = z.object({
    role: z.union([
        z.string(),
        z.number(),
    ]).refine((value) => String(value).length >= 1, {
        message: "Select a valid role",
    }),
})

export const lessonSchema = z.object({
    title: z.string().min(2, { message: "Please fill in the lesson name field!" }),
    description: z.string()
});

export const topicSchema = z.object({
    title: z.string().min(2, { message: "Please fill in the topic name field!" }),
    description: z.string()
});

export const lessonTeacherSchema = z.object({
    user_id: z.union([
        z.string(),
        z.number(),
    ]).refine((value) => String(value).length >= 1, {
        message: "Select a valid teacher",
    }),
});

export const pdfGenerateSchema = z.object({
    lesson: z.string().min(1, { message: "Please select a lesson." }),
    topic: z.string().min(1, { message: "Please select a topic." }),
    answer_type: z.string().min(1, { message: "Please select a answer type." }),
    time: z.string(),
    number: z.string().min(1, { message: "Please select a number for quiz." }),
    level: z.string().min(1, { message: "Please select a level." }),
    file: z
        .instanceof(File)
        .refine((file) => file.type === "application/pdf", "Only PDF files are allowed")
        .refine((file) => file.size <= 4 * 1024 * 1024, "File size must be less than 4MB"),
});

export const allocateStudents = z.object({
    user_id: z.union([
        z.string(),
        z.number(),
    ]).refine((value) => String(value).length >= 1, {
        message: "Select a valid students",
    }),
});

export const quizContentSchema = z.object({
    question: z.string().min(2, { message: "Please fill in the username field!" }),
    options: z.string().min(2, { message: "Please fill in the lastname field!" }),
    correct_answer: z.string().min(2, { message: "Please fill in the firstname field!" }),
});