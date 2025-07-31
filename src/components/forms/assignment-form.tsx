import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { assignmentsApi, engineersApi, projectsApi } from '@/lib/api';

interface AssignmentFormProps {
  assignment?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AssignmentForm({ assignment, onSuccess, onCancel }: AssignmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!assignment;
  const [formData, setFormData] = useState({
    engineerId: assignment?.engineerId?._id || assignment?.engineerId || '',
    projectId: assignment?.projectId?._id || assignment?.projectId || '',
    allocationPercentage: assignment?.allocationPercentage || 50,
    startDate: assignment?.startDate ? new Date(assignment.startDate).toISOString().split('T')[0] : '',
    endDate: assignment?.endDate ? new Date(assignment.endDate).toISOString().split('T')[0] : '',
    role: assignment?.role || '',
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  const { data: engineersData } = useQuery({
    queryKey: ['engineers', 'by-project', formData.projectId],
    queryFn: () => engineersApi.getByProject(formData.projectId),
    enabled: !!formData.projectId,
  });

  const projects = Array.isArray(projectsData?.data) ? projectsData.data : Array.isArray(projectsData) ? projectsData : [];
  const engineers = Array.isArray(engineersData?.data) ? engineersData.data : Array.isArray(engineersData) ? engineersData : [];
  const selectedProject = projects.find(p => p._id === formData.projectId);

  const mutation = useMutation({
    mutationFn: isEditing ? (data) => assignmentsApi.update(assignment._id, data) : assignmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['engineers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: isEditing ? "Assignment updated" : "Assignment created",
        description: `The assignment has been ${isEditing ? 'updated' : 'created'} successfully.`,
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
    
    // Validate allocation doesn't exceed available capacity
    const selectedEngineer = engineers.find(e => e._id === formData.engineerId);
    if (selectedEngineer) {
      const maxAllowedAllocation = isEditing 
        ? selectedEngineer.availableCapacity + (assignment?.allocationPercentage || 0)
        : selectedEngineer.availableCapacity;
      
      if (formData.allocationPercentage > maxAllowedAllocation) {
        toast({
          title: "Invalid allocation",
          description: `Cannot allocate ${formData.allocationPercentage}%. Only ${maxAllowedAllocation}% available.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    mutation.mutate(formData);
  };

  const isLoading = mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Project</label>
        {isEditing ? (
          <div className="p-2 bg-gray-100 rounded border">
            <span className="text-sm text-gray-700">
              {projects.find(p => p._id === formData.projectId)?.name || 'Project'}
            </span>
            <p className="text-xs text-gray-500 mt-1">Project cannot be changed when editing</p>
          </div>
        ) : (
          <Select onValueChange={(value) => setFormData({...formData, projectId: value, engineerId: ''})}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project first" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedProject && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Required Skills</label>
          <div className="flex flex-wrap gap-1">
            {selectedProject.requiredSkills?.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {formData.projectId && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Engineer</label>
          <Select value={formData.engineerId} onValueChange={(value) => setFormData({...formData, engineerId: value})}>
            <SelectTrigger>
              <SelectValue placeholder={isEditing && assignment?.engineerId?.name ? assignment.engineerId.name : "Select an engineer"} />
            </SelectTrigger>
            <SelectContent>
              {engineers.map((engineer) => (
                <SelectItem key={engineer._id} value={engineer._id} disabled={engineer.availableCapacity <= 0}>
                  <div className="flex items-center justify-between w-full py-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{engineer.name}</div>
                      <div className="text-xs text-gray-500">{engineer.department} • Available: {engineer.availableCapacity}%</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        engineer.matchPercentage >= 80 ? 'bg-green-500' :
                        engineer.matchPercentage >= 50 ? 'bg-yellow-500' :
                        engineer.matchPercentage > 0 ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs font-medium min-w-[30px] text-right">{engineer.matchPercentage}%</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.engineerId && (
            <div className="text-xs text-gray-500">
              {(() => {
                const selectedEngineer = engineers.find(e => e._id === formData.engineerId);
                return selectedEngineer ? (
                  <div>
                    <p>Matching skills: {selectedEngineer.matchingSkills?.join(', ') || 'None'}</p>
                    <p>Match: {selectedEngineer.matchPercentage}% ({selectedEngineer.matchingSkills?.length || 0}/{selectedEngineer.totalRequiredSkills})</p>
                  </div>
                ) : null;
              })()} 
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Allocation Percentage</label>
        <Input 
          type="number" 
          min="1" 
          max={formData.engineerId ? (() => {
            const engineer = engineers.find(e => e._id === formData.engineerId);
            return isEditing 
              ? (engineer?.availableCapacity || 0) + (assignment?.allocationPercentage || 0)
              : engineer?.availableCapacity || 100;
          })() : 100}
          placeholder="50"
          value={formData.allocationPercentage}
          onChange={(e) => setFormData({...formData, allocationPercentage: parseInt(e.target.value)})}
        />
        {formData.engineerId && (() => {
          const engineer = engineers.find(e => e._id === formData.engineerId);
          const maxAvailable = isEditing 
            ? (engineer?.availableCapacity || 0) + (assignment?.allocationPercentage || 0)
            : engineer?.availableCapacity || 0;
          return (
            <p className="text-xs text-gray-500">
              Max available: {maxAvailable}%
              {isEditing && ` (including current ${assignment?.allocationPercentage || 0}%)`}
            </p>
          );
        })()}
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
        <label className="text-sm font-medium">Role Description</label>
        <Input 
          placeholder="Frontend Developer" 
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
}
