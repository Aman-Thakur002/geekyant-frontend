import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  FolderKanban, 
  PieChart, 
  Battery,
  Mail,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { engineersApi, projectsApi, assignmentsApi } from '@/lib/api';

export default function ManagerDashboard() {
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [skillsModal, setSkillsModal] = useState({ open: false, engineer: null });

  const { data: engineersData, isLoading: engineersLoading } = useQuery({
    queryKey: ['engineers'],
    queryFn: () => engineersApi.getAll(),
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentsApi.getAll(),
  });

  const engineers = Array.isArray(engineersData?.data) ? engineersData.data : Array.isArray(engineersData) ? engineersData : [];
  const projects = Array.isArray(projectsData?.data) ? projectsData.data : Array.isArray(projectsData) ? projectsData : [];
  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : Array.isArray(assignmentsData) ? assignmentsData : [];

  const isLoading = engineersLoading || projectsLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalCapacity = engineers.reduce((sum, e) => sum + (e.maxCapacity || 100), 0);
  const totalUtilized = engineers.reduce((sum, e) => sum + (e.currentAllocation || 0), 0);
  const teamUtilization = totalCapacity > 0 ? Math.round((totalUtilized / totalCapacity) * 100) : 0;
  const availableCapacity = totalCapacity - totalUtilized;
  const availableCapacityPercent = totalCapacity > 0 ? Math.round((availableCapacity / totalCapacity) * 100) : 0;

  const stats = {
    totalEngineers: engineers.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    utilization: teamUtilization,
    availableCapacity: availableCapacityPercent
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Overview of team capacity and project assignments</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Engineers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEngineers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderKanban className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{stats.utilization}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.availableCapacity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engineers Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engineers.map((engineer) => (
              <div 
                key={engineer._id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedEngineer(engineer);
                  setIsProfileOpen(true);
                }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {engineer.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{engineer.name}</p>
                    <p className="text-sm text-gray-500">{engineer.department} • {engineer.seniority}</p>
                    {engineer.skills && engineer.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {engineer.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs px-1 py-0">
                            {skill}
                          </Badge>
                        ))}
                        {engineer.skills.length > 4 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-1 py-0 cursor-pointer hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSkillsModal({ open: true, engineer });
                            }}
                          >
                            +{engineer.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{engineer.currentAllocation || 0}% Utilized</p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((engineer.currentAllocation || 0) / (engineer.maxCapacity || 100)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engineer Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Engineer Profile</DialogTitle>
          </DialogHeader>
          {selectedEngineer && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {selectedEngineer.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedEngineer.name}</h3>
                  <p className="text-gray-600">{selectedEngineer.department} • {selectedEngineer.seniority}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedEngineer.email}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedEngineer.currentAllocation || 0}%</p>
                    <p className="text-sm text-gray-600">Current Load</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Battery className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedEngineer.availableCapacity || selectedEngineer.maxCapacity}%</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedEngineer.skills?.length || 0}</p>
                    <p className="text-sm text-gray-600">Skills</p>
                  </CardContent>
                </Card>
              </div>

              {/* Capacity Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Capacity Utilization</span>
                  <span className="text-sm text-gray-600">{selectedEngineer.currentAllocation || 0}% of {selectedEngineer.maxCapacity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${((selectedEngineer.currentAllocation || 0) / (selectedEngineer.maxCapacity || 100)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium mb-3">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEngineer.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  )) || <p className="text-gray-500 text-sm">No skills listed</p>}
                </div>
              </div>

              {/* Employment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Employment Type</h4>
                  <p className="text-gray-600 capitalize">{selectedEngineer.employmentType || 'Full-time'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Max Capacity</h4>
                  <p className="text-gray-600">{selectedEngineer.maxCapacity}%</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Skills Modal */}
      <Dialog open={skillsModal.open} onOpenChange={(open) => setSkillsModal({ open, engineer: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Skills - {skillsModal.engineer?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skillsModal.engineer?.skills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
