import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetComplaintsQuery } from '../../lib/api/complaintApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import { format } from 'date-fns';
import { Eye, Search } from 'lucide-react';
import { Complaint } from '../../types/complaint.types';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20',
  Under_Review: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
  Investigating: 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20',
  Resolved: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20',
  Rejected: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
};

const priorityColors: Record<string, string> = {
  Low: 'bg-gray-500/10 text-gray-500',
  Medium: 'bg-blue-500/10 text-blue-500',
  High: 'bg-orange-500/10 text-orange-500',
  Urgent: 'bg-red-500/10 text-red-500',
};

export default function ComplaintsList() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { data, isLoading } = useGetComplaintsQuery({});
  
  const complaints = data?.data?.complaints || [];

  const filteredComplaints = complaints.filter((c: Complaint) => 
    statusFilter === 'ALL' || c.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ID or Title..."
              className="pl-8 w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Under_Review">Under Review</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No complaints found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints.map((complaint: Complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-mono text-sm">{complaint.trackingId}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate" title={complaint.title}>
                        {complaint.title}
                      </TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={priorityColors[complaint.priority]}>
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[complaint.status]}>
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(complaint.createdAt), 'MMM d')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/complaints/${complaint.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
