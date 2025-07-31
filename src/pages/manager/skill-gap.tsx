import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Users, Target } from 'lucide-react';
import { engineersApi, projectsApi } from '@/lib/api';

export default function SkillGapAnalysis() {
  const { data: engineersData, isLoading: engineersLoading } = useQuery({
    queryKey: ['engineers'],
    queryFn: () => engineersApi.getAll(),
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  const engineers = Array.isArray(engineersData?.data) ? engineersData.data : [];
  const projects = Array.isArray(projectsData?.data) ? projectsData.data : [];

  const isLoading = engineersLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Analyze skills
  const teamSkills = engineers.reduce((acc, engineer) => {
    engineer.skills?.forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {});

  const requiredSkills = projects.reduce((acc, project) => {
    project.requiredSkills?.forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {});

  // Find skill gaps
  const skillGaps = Object.keys(requiredSkills).filter(skill => !teamSkills[skill]);
  const underSuppliedSkills = Object.keys(requiredSkills).filter(skill => 
    teamSkills[skill] && teamSkills[skill] < requiredSkills[skill]
  );

  // Find over-supplied skills
  const overSuppliedSkills = Object.keys(teamSkills).filter(skill => 
    !requiredSkills[skill] || teamSkills[skill] > (requiredSkills[skill] || 0)
  );

  // Most in-demand skills
  const inDemandSkills = Object.entries(requiredSkills)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // Skill coverage analysis
  const totalRequiredSkills = Object.keys(requiredSkills).length;
  const coveredSkills = totalRequiredSkills - skillGaps.length;
  const coveragePercentage = totalRequiredSkills > 0 ? Math.round((coveredSkills / totalRequiredSkills) * 100) : 100;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h1>
        <p className="text-gray-600">Identify missing skills and optimize team composition</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skill Coverage</p>
                <p className="text-2xl font-bold text-gray-900">{coveragePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Missing Skills</p>
                <p className="text-2xl font-bold text-gray-900">{skillGaps.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under-supplied</p>
                <p className="text-2xl font-bold text-gray-900">{underSuppliedSkills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Skills</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(teamSkills).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Critical Skill Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            {skillGaps.length > 0 ? (
              <div className="space-y-3">
                {skillGaps.map((skill) => (
                  <div key={skill} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="font-medium text-red-800">{skill}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        Required by {requiredSkills[skill]} project(s)
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        0 engineers
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 font-medium">No critical skill gaps!</p>
                <p className="text-sm text-gray-500">All required skills are covered by the team.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Under-supplied Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <TrendingUp className="h-5 w-5" />
              Under-supplied Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {underSuppliedSkills.length > 0 ? (
              <div className="space-y-3">
                {underSuppliedSkills.map((skill) => (
                  <div key={skill} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="font-medium text-orange-800">{skill}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-orange-100">
                        Need: {requiredSkills[skill]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Have: {teamSkills[skill]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-blue-600 font-medium">Well-balanced team!</p>
                <p className="text-sm text-gray-500">All skills have adequate coverage.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most In-Demand Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Most In-Demand Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inDemandSkills.map(([skill, demand]) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="font-medium">{skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(demand / Math.max(...Object.values(requiredSkills))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[60px] text-right">
                      {demand} project{demand > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Skill Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Team Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(teamSkills)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([skill, count]) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="font-medium">{skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / engineers.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[60px] text-right">
                      {count} engineer{count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Immediate Actions</h4>
              <ul className="space-y-2 text-sm">
                {skillGaps.length > 0 && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Hire engineers with: {skillGaps.slice(0, 3).join(', ')}</span>
                  </li>
                )}
                {underSuppliedSkills.length > 0 && (
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>Upskill team in: {underSuppliedSkills.slice(0, 3).join(', ')}</span>
                  </li>
                )}
                {skillGaps.length === 0 && underSuppliedSkills.length === 0 && (
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Team skills are well-aligned with project requirements</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Strategic Planning</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Consider cross-training in high-demand skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Plan hiring based on upcoming project requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Monitor skill trends in the industry</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}