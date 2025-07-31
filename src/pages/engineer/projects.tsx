import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, Target } from 'lucide-react';
import { assignmentsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function EngineerProjects() {
  const { user } = useAuth();
  
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ['assignments', 'engineer', user?._id],
    queryFn: () => assignmentsApi.getByEngineer(user?._id || ''),
    enabled: !!user?._id,
  });

  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : [];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Track your project assignments and progress</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Assigned</h3>
            <p className="text-gray-600">You don't have any project assignments yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                      {assignment.projectId?.name || 'Unknown Project'}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {assignment.projectId?.description || 'No description available'}
                    </p>
                  </div>
                  <Badge className={getProjectStatusColor(assignment.projectId?.status)}>
                    {assignment.projectId?.status || 'unknown'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Assignment Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium text-gray-900 truncate">{assignment.role || 'Developer'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">Allocation:</span>
                      <span className="font-medium text-gray-900">{assignment.allocationPercentage}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="outline" className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Timeline</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Start:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(assignment.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">End:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(assignment.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Allocation</span>
                    <span className="text-sm font-bold text-blue-600">{assignment.allocationPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${assignment.allocationPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {assignments.length}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {assignments.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(assignments.reduce((sum, a) => sum + a.allocationPercentage, 0))}%
              </div>
              <div className="text-sm text-gray-600">Total Allocation</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {assignments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}