import { useGetDashboardStatsQuery } from '../../lib/api/complaintApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ListTodo, Clock, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[300px] w-full mt-6" />
      </div>
    );
  }

  const stats = data?.data || {
    totalComplaints: 0, pending: 0, underReview: 0,
    investigating: 0, resolved: 0, rejected: 0
  };

  const chartData = [
    { name: 'Pending', count: stats.pending, fill: '#eab308' },
    { name: 'Reviewing', count: stats.underReview, fill: '#3b82f6' },
    { name: 'Investigating', count: stats.investigating, fill: '#f97316' },
    { name: 'Resolved', count: stats.resolved, fill: '#22c55e' },
    { name: 'Rejected', count: stats.rejected, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Complaints" value={stats.totalComplaints} icon={ListTodo} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="text-yellow-500" />
        <StatCard title="Under Review" value={stats.underReview} icon={Search} color="text-blue-500" />
        <StatCard title="Investigating" value={stats.investigating} icon={AlertCircle} color="text-orange-500" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-500" />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="text-red-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaints by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-muted-foreground" }: { title: string, value: number, icon: any, color?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
