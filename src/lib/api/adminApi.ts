// src/lib/redux/apis/adminApi.ts
import { baseApi } from "./baseApi";

// ============================================
// TYPES
// ============================================

export interface DashboardStats {
  totalComplaints: number;
  pending: number;
  underReview: number;
  investigating: number;
  resolved: number;
  rejected: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  isActive: boolean;
  createdAt: string;
}

export interface StaffRequest {
  name: string;
  email: string;
  password: string;
  role?: "staff" | "admin";
}

// ============================================
// ADMIN API
// ============================================

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========== DASHBOARD ==========
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    // ========== STAFF MANAGEMENT ==========
    getAllStaff: builder.query<StaffMember[], void>({
      query: () => ({
        url: "/admin/staff",
        method: "GET",
      }),
      providesTags: ["Staff"],
    }),

    getStaffById: builder.query<StaffMember, string>({
      query: (id) => ({
        url: `/admin/staff/${id}`,
        method: "GET",
      }),
      providesTags: ["Staff"],
    }),

    createStaff: builder.mutation<StaffMember, StaffRequest>({
      query: (data) => ({
        url: "/admin/staff",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),

    updateStaff: builder.mutation<
      StaffMember,
      { id: string; data: Partial<StaffRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/staff/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),

    deleteStaff: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),

    // ========== COMPLAINT STATISTICS ==========
    getComplaintStatsByCategory: builder.query<any, void>({
      query: () => ({
        url: "/admin/complaints/stats/category",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    getComplaintStatsByStatus: builder.query<any, void>({
      query: () => ({
        url: "/admin/complaints/stats/status",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    getComplaintStatsByPriority: builder.query<any, void>({
      query: () => ({
        url: "/admin/complaints/stats/priority",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    // ========== BULK OPERATIONS ==========
    bulkUpdateStatus: builder.mutation<
      { success: boolean; updated: number },
      { ids: string[]; status: string }
    >({
      query: ({ ids, status }) => ({
        url: "/admin/complaints/bulk/status",
        method: "PATCH",
        body: { ids, status },
      }),
      invalidatesTags: ["Complaint", "Admin"],
    }),

    bulkDeleteComplaints: builder.mutation<
      { success: boolean; deleted: number },
      { ids: string[] }
    >({
      query: ({ ids }) => ({
        url: "/admin/complaints/bulk",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Complaint", "Admin"],
    }),

    // ========== EXPORT ==========
    exportComplaints: builder.query<
      Blob,
      { format?: "csv" | "excel"; filters?: any }
    >({
      query: ({ format = "csv", filters }) => ({
        url: "/admin/complaints/export",
        method: "GET",
        params: { format, ...filters },
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),

    // ========== ACTIVITY LOGS ==========
    getActivityLogs: builder.query<
      { logs: any[]; pagination: any },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/admin/activity-logs",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Admin"],
    }),
  }),
});

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  // Dashboard
  useGetDashboardStatsQuery,

  // Staff Management
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,

  // Statistics
  useGetComplaintStatsByCategoryQuery,
  useGetComplaintStatsByStatusQuery,
  useGetComplaintStatsByPriorityQuery,

  // Bulk Operations
  useBulkUpdateStatusMutation,
  useBulkDeleteComplaintsMutation,

  // Export
  useExportComplaintsQuery,
  useLazyExportComplaintsQuery,

  // Activity Logs
  useGetActivityLogsQuery,
} = adminApi;
