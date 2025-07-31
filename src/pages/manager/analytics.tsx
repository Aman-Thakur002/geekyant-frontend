import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, FolderKanban, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { analyticsApi } from '@/lib/api';

export default function TeamAnalytics() {
  const [expandedSkills, setExpandedSkills] = useState({});
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedSeniority, setExpandedSeniority] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', 'team'],
    queryFn: () => analyticsApi.getTeamAnalytics(),
  });

  const analytics = analyticsData?.data;
  
  const toggleExpanded = (type, key) => {
    const setters = {
      skills: setExpandedSkills,
      departments: setExpandedDepts,
      seniority: setExpandedSeniority,
      projects: setExpandedProjects
    };
    setters[type](prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Analytics</h1>
        <p className="text-gray-600">Insights into team composition and performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Engineers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalEngineers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderKanban className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.overview.activeAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.overview.utilizationRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.skillDistribution?.slice(0, 10).map((item) => (
                <div key={item.skill}>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded('skills', item.skill)}
                      className="flex items-center gap-2 p-0 h-auto font-medium"
                    >
                      {expandedSkills[item.skill] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {item.skill}
                    </Button>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.count / analytics.overview.totalEngineers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-[20px]">{item.count}</span>
                    </div>
                  </div>
                  {expandedSkills[item.skill] && (
                    <div className="mt-2 ml-6 space-y-1">
                      {item.engineers?.map((engineer) => (
                        <div key={engineer._id} className="text-sm text-gray-600">
                          {engineer.name} - {engineer.department}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.departmentDistribution?.map((item) => (
                <div key={item.department}>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded('departments', item.department)}
                      className="flex items-center gap-2 p-0 h-auto font-medium"
                    >
                      {expandedDepts[item.department] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {item.department}
                    </Button>
                    <Badge variant="secondary">{item.count} engineers</Badge>
                  </div>
                  {expandedDepts[item.department] && (
                    <div className="mt-2 ml-3 space-y-1">
                      {item.engineers?.map((engineer) => (
                        <div key={engineer._id} className="text-sm text-gray-600 p-2 bg-white rounded">
                          {engineer.name} - {engineer.seniority}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seniority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Seniority Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.seniorityDistribution?.map((item) => (
                <div key={item.seniority}>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded('seniority', item.seniority)}
                      className="flex items-center gap-2 p-0 h-auto font-medium capitalize"
                    >
                      {expandedSeniority[item.seniority] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {item.seniority}
                    </Button>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                  {expandedSeniority[item.seniority] && (
                    <div className="mt-2 ml-3 space-y-1">
                      {item.engineers?.map((engineer) => (
                        <div key={engineer._id} className="text-sm text-gray-600 p-2 bg-white rounded">
                          {engineer.name} - {engineer.department}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.projectStatusDistribution?.map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded('projects', item.status)}
                      className="flex items-center gap-2 p-0 h-auto font-medium capitalize"
                    >
                      {expandedProjects[item.status] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {item.status}
                    </Button>
                    <Badge className={
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {item.count}
                    </Badge>
                  </div>
                  {expandedProjects[item.status] && (
                    <div className="mt-2 ml-3 space-y-1">
                      {item.projects?.map((project) => (
                        <div key={project._id} className="text-sm text-gray-600 p-2 bg-white rounded">
                          {project.name} - Team: {project.teamSize}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}