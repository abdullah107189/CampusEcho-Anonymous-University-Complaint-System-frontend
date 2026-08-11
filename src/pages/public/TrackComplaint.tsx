import React from "react";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrackComplaintQuery } from '../../lib/api/complaintApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  Under_Review: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  Investigating: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  Resolved: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  Rejected: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const priorityColors: Record<string, string> = {
  Low: 'bg-gray-500/10 text-gray-500',
  Medium: 'bg-blue-500/10 text-blue-500',
  High: 'bg-orange-500/10 text-orange-500',
  Urgent: 'bg-red-500/10 text-red-500',
};

export default function TrackComplaint() {
  const { trackingId } = useParams<{ trackingId: string }>();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(trackingId || '');

  const { data, isLoading, isError, error, refetch } = useTrackComplaintQuery(trackingId || '', {
    skip: !trackingId
  });

  useEffect(() => {
    if (trackingId) {
      setSearchInput(trackingId);
      refetch();
    }
  }, [trackingId, refetch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim()}`);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Track Your Complaint</h1>
        <p className="text-muted-foreground">Enter your tracking ID to view the current status of your complaint.</p>
        
        <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
          <Input 
            placeholder="e.g. A1B2C3D4" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Track
          </Button>
        </form>
      </div>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      )}

      {isError && trackingId && (
        <Card className="border-destructive/50 bg-destructive/5 text-center py-12">
          <CardContent>
            <p className="text-destructive font-medium text-lg">
              {((error as any)?.data?.message) || 'Complaint not found. Please check the tracking ID and try again.'}
            </p>
          </CardContent>
        </Card>
      )}

      {data?.data && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">{data.data.title}</CardTitle>
              <CardDescription>
                Tracking ID: <span className="font-mono font-medium">{data.data.trackingId}</span>
              </CardDescription>
            </div>
            <Badge className={statusColors[data.data.status]} variant="outline">
              {data.data.status.replace('_', ' ')}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{data.data.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Priority</p>
                <Badge className={priorityColors[data.data.priority]} variant="secondary">
                  {data.data.priority}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Date Submitted</p>
                <p className="font-medium">
                  {format(new Date(data.data.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {data.data.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
