import axios from "@/api/axios";
import { RootState } from "@/lib/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Quiz } from "@/utils/types";

interface QueryParams {
    page: number;
    limit: number;
    filter: string | null;
}

interface Lessons {
    id: string;
    title: string;
    description?: string;
}

interface Topics {
    id: string;
    title: string;
    description?: string;
}

interface LessonState {
    query: QueryParams;
    loading: boolean;
    lessons: Lessons[];
    topics: Topics[];
    quiz: Quiz[];
}

const initialState: LessonState = {
    query: {
        page: 1,
        limit: 25,
        filter: null,
    },
    loading: false,
    lessons: [],
    topics: [],
    quiz: []
};

export const loadLessons = createAsyncThunk(
    "lesson/loadLessons",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios
                .get("lessons")
                .then((data) => data);;
            return response.data.lessons;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred.");
        }
    }
);

export const loadTopics = createAsyncThunk<Topics[], string>(
    "lesson/loadTopics",
    async (lessonId, { rejectWithValue }) => {
        try {
            const response = await axios
                .get(`/lesson/${lessonId}/topics`)
                .then((data) => data);
            return response.data.topics;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred.");
        }
    }
);

export const loadQuizzes = createAsyncThunk<Quiz[], string>(
    "lesson/loadQuizzes",
    async (topicId, { rejectWithValue }) => {
        try {
            const response = await axios
                .get(`/topic/${topicId}/quiz`)
                .then((data) => data);
            return response.data.quizzes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred.");
        }
    }
);

const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadLessons.fulfilled, (state, action) => {
                state.lessons = action.payload;
            })
            .addCase(loadTopics.fulfilled, (state, action) => {
                state.topics = action.payload;
            })
            .addCase(loadQuizzes.fulfilled, (state, action) => {
                state.quiz = action.payload;
            });
    },
});

export const { setQuery } = lessonSlice.actions;
export const selectLessons = (state: RootState) => state.lesson.lessons;
export const selectTopics = (state: RootState) => state.lesson.topics;
export const selectQuizzes = (state: RootState) => state.lesson.quiz;
export default lessonSlice.reducer;
