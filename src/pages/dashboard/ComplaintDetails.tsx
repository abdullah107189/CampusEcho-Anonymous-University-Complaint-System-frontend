import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  useGetComplaintByIdQuery, 
  useUpdateStatusMutation,
  useAddNoteMutation,
  useDeleteComplaintMutation
} from '../../lib/store/api/complaintApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Clock, MessageSquare, Trash2, User } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Under_Review: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Investigating: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Resolved: 'bg-green-500/10 text-green-500 border-green-500/20',
  Rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const priorityColors: Record<string, string> = {
  Low: 'bg-gray-500/10 text-gray-500',
  Medium: 'bg-blue-500/10 text-blue-500',
  High: 'bg-orange-500/10 text-orange-500',
  Urgent: 'bg-red-500/10 text-red-500',
};

export default function ComplaintDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [noteContent, setNoteContent] = useState('');
  
  const { data, isLoading } = useGetComplaintByIdQuery(id || '', { skip: !id });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [addNote, { isLoading: isAddingNote }] = useAddNoteMutation();
  const [deleteComplaint, { isLoading: isDeleting }] = useDeleteComplaintMutation();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id: id as string, status: newStatus }).unwrap();
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    try {
      await addNote({ id: id as string, content: noteContent }).unwrap();
      setNoteContent('');
      toast.success('Note added');
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this complaint? This cannot be undone.')) {
      try {
        await deleteComplaint(id as string).unwrap();
        toast.success('Complaint deleted');
        navigate('/admin/complaints');
      } catch (err) {
        toast.error('Failed to delete complaint');
      }
    }
  };

  if (isLoading) {
    return <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
    </div>;
  }

  const complaint = data?.data;

  if (!complaint) {
    return <div>Complaint not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/admin/complaints" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Link>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="font-mono">{complaint.trackingId}</Badge>
                <Badge variant="outline" className={statusColors[complaint.status]}>
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{complaint.title}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                <Clock className="mr-1 h-3.5 w-3.5" />
                Submitted {format(new Date(complaint.createdAt), 'PPP at p')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                  {complaint.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {complaint.notes?.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No notes yet.</p>
                ) : (
                  complaint.notes?.map((note: any) => (
                    <div key={note.id} className="bg-muted p-3 rounded-lg text-sm">
                      <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Admin Staff</span>
                        <span>{format(new Date(note.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                      <p>{note.content}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="pt-4 border-t space-y-2 mt-4">
                <Textarea 
                  placeholder="Add an internal note..." 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button 
                  onClick={handleAddNote} 
                  disabled={!noteContent.trim() || isAddingNote}
                  className="w-full sm:w-auto"
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select value={complaint.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Under_Review">Under Review</SelectItem>
                    <SelectItem value="Investigating">Investigating</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{complaint.category}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Priority</span>
                <Badge variant="secondary" className={priorityColors[complaint.priority]}>
                  {complaint.priority}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Assigned To</span>
                <span className="font-medium flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {complaint.assignedTo || 'Unassigned'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
