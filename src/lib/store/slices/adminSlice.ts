// src/lib/redux/slices/adminSlice.ts
import { ActivityLog } from '@/types/admin.types';
import { DashboardStats } from '@/types/complaint.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
interface AdminState {
  dashboardStats: DashboardStats | null;
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  dashboardStats: null,
  activityLogs: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setDashboardStats: (state, action: PayloadAction<DashboardStats>) => {
      state.dashboardStats = action.payload;
      state.isLoading = false;
    },
    setActivityLogs: (state, action: PayloadAction<ActivityLog[]>) => {
      state.activityLogs = action.payload;
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAdminError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearAdmin: (state) => {
      state.dashboardStats = null;
      state.activityLogs = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setDashboardStats,
  setActivityLogs,
  setAdminLoading,
  setAdminError,
  clearAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;