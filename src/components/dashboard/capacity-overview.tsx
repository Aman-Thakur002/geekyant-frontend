import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Engineer } from '@/types';

interface CapacityOverviewProps {
  engineers: Engineer[];
  onFilterChange?: (department: string) => void;
}

export function CapacityOverview({ engineers, onFilterChange }: CapacityOverviewProps) {
  const getCapacityColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCapacityStatus = (utilization: number) => {
    if (utilization >= 90) return { label: 'Overloaded', color: 'text-red-800' };
    if (utilization >= 70) return { label: 'Optimal', color: 'text-yellow-800' };
    return { label: 'Available', color: 'text-green-800' };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getSkillColor = (skill: string) => {
    const skillColors: Record<string, string> = {
      'React': 'bg-blue-100 text-blue-800',
      'Node.js': 'bg-green-100 text-green-800',
      'TypeScript': 'bg-blue-100 text-blue-800',
      'Python': 'bg-yellow-100 text-yellow-800',
      'MongoDB': 'bg-green-100 text-green-800',
    };
    return skillColors[skill] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>Team Capacity Overview</CardTitle>
          <Select onValueChange={onFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Full Stack">Full Stack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {engineers.map((engineer) => {
            const utilization = engineer.currentCapacity || 0;
            const status = getCapacityStatus(utilization);
            
            return (
              <div key={engineer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials(engineer.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{engineer.name}</p>
                    <p className="text-sm text-gray-500">{engineer.department}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      {engineer.skills?.slice(0, 2).map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className={cn("text-xs", getSkillColor(skill))}
                        >
                          {skill}
                        </Badge>
                      ))}
                      {engineer.skills && engineer.skills.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">
                          +{engineer.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {utilization}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">utilized</span>
                  </div>
                  <Progress 
                    value={utilization} 
                    className="w-32 h-2"
                  />
                  <p className={cn("text-xs mt-1", status.color)}>
                    {status.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
