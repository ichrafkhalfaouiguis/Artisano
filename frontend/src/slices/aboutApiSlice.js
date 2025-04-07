import { ABOUT_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const aboutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => ({
        url: ABOUT_URL,
        method: 'GET',
      }),
      providesTags: ['About'],
    }),
    updateAbout: builder.mutation({
      query: ({ data }) => ({
        url: ABOUT_URL,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['About'],
    }),
  }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApiSlice;
