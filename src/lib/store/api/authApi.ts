import { baseApi } from './baseApi';
import { User } from '../../../types/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ success: boolean; data: { user: User; token: string } }, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<{ success: boolean; data: { user: User } }, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;
