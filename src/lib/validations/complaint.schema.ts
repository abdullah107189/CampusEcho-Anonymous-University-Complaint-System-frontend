import { z } from 'zod';

export const complaintSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Academic', 'Facilities', 'Administrative', 'Hostel', 'Transport', 'IT_Services', 'Library', 'Sports', 'Cafeteria', 'Other']),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
