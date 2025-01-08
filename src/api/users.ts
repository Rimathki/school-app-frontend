import { formatQuery } from '@/utils/format';
import { api } from './api';
import { RootState } from '@/lib/store'
import { User, Role, UsersResponse, UserResponse, SuccessResponse, AssignRolePayload, TeachersResponse } from '@/utils/types';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersResponse, string>({
      query: (query) => `/core/user?${query}`,
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),
    getUser: build.query<User, string>({
      query: (id) => `core/user/${id}`,
      keepUnusedDataFor: 0,
      transformResponse: (response: UserResponse) => response.user,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    createUser: build.mutation<UserResponse, Partial<User>>({
      query: (body) => ({
        url: "core/user",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const currentQuery = formatQuery((getState() as RootState).user.query);      
          dispatch(
            userApi.util.updateQueryData(
              'getUsers',
              currentQuery,
              (draft) => {
                draft.users.unshift(data.user);
              }
            )
          );
        } catch(error) {
          console.log('Mutation failed:', error);
        }
      }      
    }),
    updateUser: build.mutation<UserResponse, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `core/user/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted({}, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const currentQuery = formatQuery((getState() as RootState).user.query);
          dispatch(
            userApi.util.updateQueryData("getUsers" as const, currentQuery, (draft) => {
              const index = draft.users.findIndex((user) => user.id === data.user.id);
              if (index !== -1) Object.assign(draft.users[index], data.user);
            })
          );
        } catch (error) {
          console.log("Mutation failed:", error);
        }
      },
    }),
    deleteUser: build.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `core/user/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const currentQuery = formatQuery((getState() as RootState).user.query);
          if (data.success) {
            dispatch(
              userApi.util.updateQueryData("getUsers" as const, currentQuery, (state) => {
                const index = state.users.findIndex((user) => user.id === id);
                if (index !== -1) state.users.splice(index, 1);
              })
            );
          }
        } catch(error) {
          console.log('Mutation failed:', error);
        }
      },
    }),
    getRoles: build.query<Role[], void>({
      query: () => "/core/roles",
      transformResponse: (response: { roles: Role[] }) => response.roles,
    }),
    updatePassword: build.mutation<void, { userId: string; newPassword: string }>({
      query: (body) => ({
        url: "core/user/change-password",
        method: "POST",
        body,
      }),
    }),
    assignUserRole: build.mutation<SuccessResponse, AssignRolePayload>({
      query: (body) => ({
        url: `core/user-role`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    getAllTeachers: build.query<TeachersResponse, string>({
      query: (query) => `/core/all-teachers?${query}`,
      providesTags: (result) =>
        result?.teachers
          ? [
              ...result.teachers.map(({ id }) => ({ type: 'Teachers' as const, id })),
              { type: 'Teachers' as const, id: 'LIST' },
            ]
          : [{ type: 'Teachers' as const, id: 'LIST' }],
    }),
    addStudentToTeacher: build.mutation<SuccessResponse, { teacherId: string; studentId: string }>({
      query: (body) => ({
          url: '/core/add-student-to-teacher',
          method: 'POST',
          body,
      }),
      invalidatesTags: ['Teachers'],
    }),
    removeStudentFromTeacher: build.mutation<SuccessResponse, { teacherId: string; studentId: string }>({
      query: ({ teacherId, studentId }) => ({
          url: `core/remove-student`,
          method: "POST",
          body: { teacherId, studentId },
      }),
      invalidatesTags: ["Teachers"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation,
  useGetRolesQuery,
  useAssignUserRoleMutation,
  useGetAllTeachersQuery,
  useAddStudentToTeacherMutation,
  useRemoveStudentFromTeacherMutation
} = userApi;
