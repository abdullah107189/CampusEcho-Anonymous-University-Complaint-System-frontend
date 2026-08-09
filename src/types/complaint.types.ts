export type ComplaintCategory = 'Academic' | 'Facilities' | 'Administrative' | 'Hostel' | 'Transport' | 'IT_Services' | 'Library' | 'Sports' | 'Cafeteria' | 'Other';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ComplaintStatus = 'Pending' | 'Under_Review' | 'Investigating' | 'Resolved' | 'Rejected';

export interface ComplaintNote {
  id: number;
  complaintId: number;
  content: string;
  createdAt: string;
}

export interface Complaint {
  id: number;
  trackingId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  assignedTo?: string | null;
  notes?: ComplaintNote[];
}

export interface DashboardStats {
  totalComplaints: number;
  pending: number;
  underReview: number;
  investigating: number;
  resolved: number;
  rejected: number;
}
