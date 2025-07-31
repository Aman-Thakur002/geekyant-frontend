import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ProjectWithDetails } from '@/types';

interface ProjectsTableProps {
  projects: ProjectWithDetails[];
  onView?: (project: ProjectWithDetails) => void;
  onEdit?: (project: ProjectWithDetails) => void;
}

export function ProjectsTable({ projects, onView, onEdit }: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>Active Projects</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Project</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Skills Required</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex -space-x-2">
                      {project.engineers?.slice(0, 3).map((engineer, index) => (
                        <Avatar key={engineer.id} className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-primary text-white text-xs">
                            {getInitials(engineer.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.engineers && project.engineers.length > 3 && (
                        <Avatar className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                            +{project.engineers.length - 3}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.requiredSkills?.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.requiredSkills && project.requiredSkills.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.requiredSkills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center">
                      <Progress value={project.progress || 0} className="w-16 h-2 mr-3" />
                      <span className="text-sm text-gray-600">{project.progress || 0}%</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-gray-900">
                    {format(new Date(project.endDate), 'MMM dd, yyyy')}
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={cn("text-xs capitalize", getStatusColor(project.status))}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(project)}
                      >
                        <Eye className="h-4 w-4 text-accent" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(project)}
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
