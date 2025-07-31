import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FolderKanban } from 'lucide-react';
import { assignmentsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function EngineerDashboard() {
  const { user } = useAuth();
  
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ['assignments', 'engineer', user?._id],
    queryFn: () => assignmentsApi.getByEngineer(user?._id || ''),
    enabled: !!user?._id,
  });

  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : Array.isArray(assignmentsData) ? assignmentsData : [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const totalAllocation = activeAssignments.reduce((sum, a) => sum + (a.allocationPercentage || 0), 0);
  const maxCapacity = user?.maxCapacity || 100;
  const availableCapacity = Math.max(0, maxCapacity - totalAllocation);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Overview of your assignments and workload</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderKanban className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{activeAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{totalAllocation}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{availableCapacity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>My Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {assignment.projectId?.name || 'Project'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {assignment.role} • {assignment.allocationPercentage}% allocation
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <Badge className={getStatusColor(assignment.status)}>
                  {assignment.status}
                </Badge>
              </div>
            ))}
            
            {assignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No assignments found. You'll see your project assignments here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Current Workload</span>
              <span className="text-sm text-gray-600">{totalAllocation}% of {maxCapacity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (totalAllocation / maxCapacity) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Available: {availableCapacity}%</span>
              <span>Max Capacity: {maxCapacity}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}