import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import { projectsApi } from '@/lib/api';
import { ProjectForm } from '@/components/forms/project-form';
import { useToast } from '@/hooks/use-toast';

export default function ManagerProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, project: null });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['engineers'] });
      toast({ title: 'Project deleted successfully' });
      setDeleteConfirm({ open: false, project: null });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete project', description: error.message, variant: 'destructive' });
    },
  });

  const projects = Array.isArray(projectsData?.data) ? projectsData.data : Array.isArray(projectsData) ? projectsData : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your projects and assignments</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm 
              onSuccess={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditProject(project)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirm({ open: true, project })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Timeline</p>
                  <p className="text-sm text-gray-500">
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Team Size</p>
                  <p className="text-sm text-gray-500">{project.teamSize} members</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSkills?.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.requiredSkills && project.requiredSkills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.requiredSkills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Project Modal */}
      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            project={editProject}
            onSuccess={() => setEditProject(null)}
            onCancel={() => setEditProject(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open, project: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{deleteConfirm.project?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm({ open: false, project: null })}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteMutation.mutate(deleteConfirm.project?._id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}