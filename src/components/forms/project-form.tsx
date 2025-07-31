import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { projectsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface ProjectFormProps {
  project?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AVAILABLE_SKILLS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Python', 'Django',
  'TypeScript', 'JavaScript', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker',
  'Kubernetes', 'Redis', 'GraphQL', 'REST API', 'HTML', 'CSS', 'Tailwind CSS'
];

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = !!project;
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    requiredSkills: project?.requiredSkills || [],
    teamSize: project?.teamSize || 1,
    status: project?.status || 'planning',
    managerId: user?._id || '',
  });

  const mutation = useMutation({
    mutationFn: isEditing ? (data) => projectsApi.update(project._id, data) : projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['engineers'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: isEditing ? "Project updated" : "Project created",
        description: `The project has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const addSkill = (skill: string) => {
    if (!formData.requiredSkills.includes(skill)) {
      setFormData({...formData, requiredSkills: [...formData.requiredSkills, skill]});
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({...formData, requiredSkills: formData.requiredSkills.filter(skill => skill !== skillToRemove)});
  };

  const isLoading = mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <Input 
            placeholder="New Web Application" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            placeholder="Build a modern web application with React and Node.js"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Input 
              type="date" 
              min={new Date().toISOString().split('T')[0]}
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Input 
              type="date" 
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Required Skills</label>
          <Select onValueChange={addSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Add a skill" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_SKILLS.filter(skill => !formData.requiredSkills.includes(skill)).map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {formData.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Team Size</label>
            <Input 
              type="number" 
              min="1" 
              placeholder="3"
              value={formData.teamSize}
              onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
  );
}
