import { formatQuery } from '@/utils/format';
import { api } from './api';
import { RootState } from '@/lib/store';
import { LessonResponse, Lesson, LessonsResponse, Topic, Quiz, QuizResponse, Creator, SuccessResponse, QuizContent, QuizzesResponse } from '@/utils/types';

export const lessonApi = api.injectEndpoints({
    endpoints: (build) => ({
        getLessons: build.query<LessonsResponse, string>({
            query: (query) => `lessons?${query}`,
            providesTags: (result) =>
                result?.lessons
                ? [
                    ...result.lessons.map(({ id }) => ({ type: "Lessons" as const, id })),
                    { type: "Lessons" as const, id: "LIST" },
                    ]
                : [{ type: "Lessons" as const, id: "LIST" }],
            }),
            getLesson: build.query<Lesson, string>({
            query: (id) => `lesson/${id}`,
            keepUnusedDataFor: 0,
            transformResponse: (response: LessonResponse) => response.lesson,
            providesTags: (result, error, id) => [{ type: "Lessons", id }],
        }),
        createLesson: build.mutation<LessonResponse, Partial<Lesson>>({
            query: (body) => ({
                url: "lessons",
                method: "POST",
                body,
            }),
            async onQueryStarted(body, { dispatch, getState, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data)
                    const currentQuery = formatQuery((getState() as RootState).lesson.query);
                    dispatch(
                        lessonApi.util.updateQueryData(
                        'getLessons',
                            currentQuery,
                            (draft) => {
                                draft.lessons.unshift(data.lesson);
                            }
                        )
                    );
                } catch (error) {
                    console.log('Mutation failed:', error);
                }
            },
        }),
        updateLesson: build.mutation<LessonResponse, { id: string; body: Partial<Lesson> }>({
            query: ({ id, body }) => ({
                url: `lesson/${id}`,
                method: "PUT",
                body,
            }),
            async onQueryStarted({}, { dispatch, getState, queryFulfilled }) {
                try {
                const { data } = await queryFulfilled;
                const currentQuery = formatQuery((getState() as RootState).lesson.query);
                dispatch(
                    lessonApi.util.updateQueryData("getLessons" as const, currentQuery, (draft) => {
                    const index = draft.lessons.findIndex((lesson) => lesson.id === data.lesson.id);
                    if (index !== -1) Object.assign(draft.lessons[index], data.lesson);
                    })
                );
                } catch (error) {
                console.log("Mutation failed:", error);
                }
        },
        }),
        deleteLesson: build.mutation<SuccessResponse, string>({
            query: (id) => ({
            url: `lesson/${id}`,
            method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const currentQuery = formatQuery((getState() as RootState).lesson.query);

                    if (data.success) {
                    dispatch(
                        lessonApi.util.updateQueryData("getLessons" as const, currentQuery, (state) => {
                            const index = state.lessons.findIndex((lesson) => lesson.id === id);
                            if (index !== -1) {
                                state.lessons.splice(index, 1);
                            }
                        })
                    );
                    }
                } catch (error) {
                    console.log("Mutation failed:", error);
                }
            },
        }),      
        getTopics: build.query<Topic[], string>({
            query: (lessonId) => `lesson/${lessonId}/topics`,
            transformResponse: (response: { topics: Topic[] }) => response.topics,
        }),
        createTopic: build.mutation<SuccessResponse, { lessonId: string; body: Partial<Topic> }>({
            query: ({ lessonId, body }) => ({
                url: `lesson/${lessonId}/topics`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { lessonId }) => [{ type: "Topics", id: lessonId }],
        }),
        updateTopic: build.mutation<SuccessResponse, { id: string; body: Partial<Topic> }>({
            query: ({ id, body }) => ({
                url: `topic/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Topics"],
        }),
        
        deleteTopic: build.mutation<SuccessResponse, string>({
            query: (id) => ({
                url: `topic/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Topics"],
        }),
        getLessonTeachers: build.query<Creator[], string>({
            query: (lessonId) => `lesson/${lessonId}/teachers`,
            transformResponse: (response: { teachers: Creator[] }) => response.teachers,
        }),
        addLessonTeacher: build.mutation<SuccessResponse, { lessonId: string; userId: string }>({
            query: ({ lessonId, userId }) => ({
                url: `lesson/${lessonId}/teachers`,
                method: "POST",
                body: { userId },
            }),
            invalidatesTags: (result, error, { lessonId }) => [{ type: "Lessons", id: lessonId }],
        }),
        removeLessonTeacher: build.mutation<SuccessResponse, { lessonId: string; userId: string }>({
            query: ({ lessonId, userId }) => ({
                url: `lesson/${lessonId}/teachers`,
                method: "DELETE",
                body: { userId },
            }),
            invalidatesTags: (result, error, { lessonId }) => [{ type: "Lessons", id: lessonId }],
        }),
        getAllQuizzes: build.query<QuizzesResponse, void>({
            query: () => ({
                url: `quizzes`,
                method: "GET",
            }),
            providesTags: (result) =>
                result?.quizzes
                    ? [
                          ...result.quizzes.map(({ id }) => ({ type: "Quizzes" as const, id })),
                          { type: "Quizzes" as const, id: "LIST" },
                      ]
                    : [{ type: "Quizzes" as const, id: "LIST" }],
        }),
                     
        saveQuiz: build.mutation<QuizResponse, { topicId: string; duration: number; level: number; content: QuizContent[]}>({
            query: ({ topicId, ...body }) => ({
                url: `topic/${topicId}/quiz`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { topicId }) => [{ type: "Topics", id: topicId }],
        }),
        updateQuiz: build.mutation<QuizResponse, { id: string; body: Partial<Quiz> }>({
            query: ({ id, body }) => ({
                url: `quiz/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Quizzes", id }],
        }),
        getAllTopics: build.query<Topic[], void>({
            query: () => `topics`,
            transformResponse: (response: { topics: Topic[] }) => response.topics,
            providesTags: (result) =>
                result?.length
                    ? [...result.map(({ id }) => ({ type: "Topics" as const, id })), { type: "Topics", id: "LIST" }]
                    : [{ type: "Topics", id: "LIST" }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetLessonsQuery,
    useGetLessonQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useGetTopicsQuery,
    useCreateTopicMutation,
    useUpdateTopicMutation,
    useDeleteTopicMutation,
    useGetLessonTeachersQuery,
    useAddLessonTeacherMutation,
    useRemoveLessonTeacherMutation,
    useGetAllQuizzesQuery,
    useSaveQuizMutation,
    useUpdateQuizMutation,
    useGetAllTopicsQuery,
} = lessonApi;
