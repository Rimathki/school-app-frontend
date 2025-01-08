import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_REST_API}/api/`,
  credentials: "include",
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  keepUnusedDataFor: 120,
  tagTypes: ['Users', 'Lessons', 'Topics', 'Teachers', 'Students', 'Quizzes'],
  endpoints: () => ({}),
});
