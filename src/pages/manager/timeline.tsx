import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { assignmentsApi } from '@/lib/api';

export default function TimelineView() {
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentsApi.getAll(),
  });

  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Group assignments by month
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    const startDate = new Date(assignment.startDate);
    const monthKey = `${startDate.getFullYear()}-${startDate.getMonth()}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        assignments: []
      };
    }
    
    acc[monthKey].assignments.push(assignment);
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months`;
    return `${Math.round(diffDays / 365)} years`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Timeline View</h1>
        <p className="text-gray-600">Calendar view of assignment durations and schedules</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Engineers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(assignments.map(a => a.engineerId?._id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(assignments.map(a => a.projectId?._id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedAssignments)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([monthKey, { month, assignments: monthAssignments }]) => (
          <Card key={monthKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {month}
                <Badge variant="outline">{monthAssignments.length} assignments</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthAssignments.map((assignment) => (
                  <div key={assignment._id} className="border-l-4 border-l-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {assignment.projectId?.name || 'Unknown Project'}
                          </h3>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{assignment.engineerId?.name || 'Unknown Engineer'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{assignment.allocationPercentage}% allocation</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Duration: {getDuration(assignment.startDate, assignment.endDate)}
                        </div>
                      </div>
                    </div>
                    
                    {assignment.role && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Role: {assignment.role}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assignments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
            <p className="text-gray-600">There are no assignments to display in the timeline.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}