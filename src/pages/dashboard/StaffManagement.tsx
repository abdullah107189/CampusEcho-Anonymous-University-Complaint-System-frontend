import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Users } from 'lucide-react';

export default function StaffManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Staff Directory
          </CardTitle>
          <CardDescription>Manage administrative staff and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm">
              The staff management module is currently under development. Check back later for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
