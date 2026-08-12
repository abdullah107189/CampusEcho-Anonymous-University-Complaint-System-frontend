import { baseApi } from "./baseApi";
import {
  Complaint,
  DashboardStats,
  ComplaintNote,
} from "../../types/complaint.types";

export const complaintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    submitComplaint: builder.mutation<
      { success: boolean; data: { trackingId: string } },
      any
    >({
      query: (data) => ({ url: "/complaints", method: "POST", body: data }),
    }),

    trackComplaint: builder.query<
      { success: boolean; data: Complaint },
      string
    >({
      query: (trackingId) => `/complaints/track/${trackingId}`,
    }),

    getDashboardStats: builder.query<
      { success: boolean; data: DashboardStats },
      void
    >({
      query: () => "/admin/dashboard",
      providesTags: ["DashboardStats"],
    }),

    getComplaints: builder.query<
      { success: boolean; data: { complaints: Complaint[]; pagination: any } },
      any
    >({
      query: (filters) => ({
        url: "/admin/complaints",
        params: filters,
      }),
      providesTags: ["Complaint"],
    }),

    getComplaintById: builder.query<
      {
        success: boolean;
        data: Complaint & { notes: ComplaintNote[]; statusHistory: any[] };
      },
      string
    >({
      query: (id) => `/admin/complaints/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Complaint", id }],
    }),

    updateStatus: builder.mutation<
      { success: boolean; data: { complaint: Complaint } },
      { id: number | string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/admin/complaints/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Complaint", "DashboardStats"],
    }),

    assignComplaint: builder.mutation<
      { success: boolean; data: { complaint: Complaint } },
      { id: number | string; staffId: string }
    >({
      query: ({ id, staffId }) => ({
        url: `/admin/complaints/${id}/assign`,
        method: "PATCH",
        body: { staffId },
      }),
      invalidatesTags: ["Complaint"],
    }),

    addNote: builder.mutation<
      { success: boolean; data: { note: ComplaintNote } },
      { id: number | string; content: string }
    >({
      query: ({ id, content }) => ({
        url: `/admin/complaints/${id}/notes`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Complaint", id: arg.id },
      ],
    }),

    deleteComplaint: builder.mutation<
      { success: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/admin/complaints/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Complaint", "DashboardStats"],
    }),
    
  }),
});

export const {
  useSubmitComplaintMutation,
  useTrackComplaintQuery,
  useGetDashboardStatsQuery,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useUpdateStatusMutation,
  useAssignComplaintMutation,
  useAddNoteMutation,
  useDeleteComplaintMutation,
} = complaintApi;
