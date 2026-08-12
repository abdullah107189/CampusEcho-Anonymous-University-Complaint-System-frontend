// src/lib/redux/types/admin.types.ts

export interface DashboardStats {
  totalComplaints: number;
  pending: number;
  underReview: number;
  investigating: number;
  resolved: number;
  rejected: number;
  // Optional: additional stats
  complaintsByCategory?: Record<string, number>;
  complaintsByPriority?: Record<string, number>;
  recentActivity?: ActivityLog[];
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedComplaints?: number;
}

export interface StaffRequest {
  name: string;
  email: string;
  password: string;
  role?: 'staff' | 'admin';
}

export interface StaffUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'staff' | 'admin';
  isActive?: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  details: any;
  createdAt: string;
}

export interface BulkOperationResponse {
  success: boolean;
  updated?: number;
  deleted?: number;
  failed?: number;
  errors?: string[];
}

export interface ExportFilters {
  status?: string;
  category?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}