import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Battery } from 'lucide-react';
import { analyticsApi } from '@/lib/api';

export default function CapacityPlanning() {
  const { data: capacityData, isLoading } = useQuery({
    queryKey: ['analytics', 'capacity'],
    queryFn: () => analyticsApi.getCapacityPlanning(),
  });

  const capacity = capacityData?.data;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getUtilizationColor = (percentage) => {
    if (percentage > 100) return 'text-red-600';
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getUtilizationBg = (percentage) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Capacity Planning</h1>
        <p className="text-gray-600">Monitor team workload and resource allocation</p>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Over-utilized</p>
                <p className="text-2xl font-bold text-gray-900">{capacity?.insights.overUtilized}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fully Utilized</p>
                <p className="text-2xl font-bold text-gray-900">{capacity?.insights.fullyUtilized}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under-utilized</p>
                <p className="text-2xl font-bold text-gray-900">{capacity?.insights.underUtilized}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Battery className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{capacity?.insights.totalAvailableCapacity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engineers Capacity */}
      <Card>
        <CardHeader>
          <CardTitle>Engineer Capacity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {capacity?.engineers?.map((engineer) => (
              <div key={engineer._id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {engineer.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{engineer.name}</h3>
                      <p className="text-sm text-gray-500">{engineer.department} • {engineer.seniority}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getUtilizationColor(engineer.utilizationPercentage)}`}>
                      {engineer.utilizationPercentage}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {engineer.currentAllocation}% of {engineer.maxCapacity}%
                    </p>
                  </div>
                </div>
                
                {/* Capacity Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getUtilizationBg(engineer.utilizationPercentage)}`}
                      style={{ width: `${Math.min(100, engineer.utilizationPercentage)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Assignments */}
                {engineer.assignments?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Assignments:</p>
                    <div className="flex flex-wrap gap-2">
                      {engineer.assignments.map((assignment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {assignment.projectName} ({assignment.allocation}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}