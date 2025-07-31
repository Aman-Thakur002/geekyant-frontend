import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { assignmentsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function EngineerAssignments() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600">View all your project assignments and timeline</p>
      </div>

      {/* Active Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Assignments ({activeAssignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAssignments.map((assignment) => (
              <div key={assignment._id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {assignment.projectId?.name || 'Project'}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Role:</span> {assignment.role}</p>
                      <p><span className="font-medium">Allocation:</span> {assignment.allocationPercentage}%</p>
                      <p><span className="font-medium">Timeline:</span> {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}</p>
                      {assignment.projectId?.description && (
                        <p><span className="font-medium">Description:</span> {assignment.projectId.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                </div>
                
                {assignment.projectId?.requiredSkills && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignment.projectId.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {activeAssignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No active assignments. You'll see your current projects here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Assignments */}
      {completedAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Assignments ({completedAssignments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedAssignments.map((assignment) => (
                <div key={assignment._id} className="p-4 border rounded-lg opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {assignment.projectId?.name || 'Project'}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Role:</span> {assignment.role}</p>
                        <p><span className="font-medium">Allocation:</span> {assignment.allocationPercentage}%</p>
                        <p><span className="font-medium">Timeline:</span> {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}