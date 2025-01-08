import axios from "@/api/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Teachers } from '@/utils/types'

interface QueryParams {
  page: number;
  limit: number;
  filter: string | null;
}

interface UserState {
  query: QueryParams;
  teachers: Teachers[];
  students: Teachers[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  query: {
    page: 1,
    limit: 25,
    filter: null,
  },
  teachers: [],
  students: [],
  loading: false,
  error: null,
};

export const loadTeachers = createAsyncThunk(
  "core/loadTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("core/teachers");
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load teachers");
    }
  }
);

export const loadStudents = createAsyncThunk(
  "core/students",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("core/students");
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load students");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setQuery: (state, { payload }: PayloadAction<Partial<QueryParams>>) => {
      state.query = { ...state.query, ...payload };
    },
    setPage: (state, { payload }: PayloadAction<number>) => {
      state.query.page = payload;
    },
    setLimit: (state, { payload }: PayloadAction<number>) => {
      state.query.limit = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTeachers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.teachers = payload.teachers;
      })
      .addCase(loadStudents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.students = payload.students;
      })
  },
});

export const { setQuery, setPage, setLimit } = userSlice.actions;

export const selectQuery = (state: { user: UserState }) => state.user.query;
export const selectTeachers = (state: { user: UserState }) => state.user.teachers;
export const selectStudents = (state: { user: UserState }) => state.user.students;

export default userSlice.reducer;
