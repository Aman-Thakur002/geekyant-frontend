import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { engineersApi } from '@/lib/api';

interface EngineerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AVAILABLE_SKILLS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Python', 'Django',
  'TypeScript', 'JavaScript', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker',
  'Kubernetes', 'Redis', 'GraphQL', 'REST API', 'HTML', 'CSS', 'Tailwind CSS'
];

export function EngineerForm({ onSuccess, onCancel }: EngineerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'Engineer',
    skills: [] as string[],
    seniority: 'junior',
    department: '',
    employmentType: 'full-time',
    maxCapacity: 100,
  });

  const createMutation = useMutation({
    mutationFn: engineersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engineers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: "Engineer created",
        description: "The engineer has been created successfully.",
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
    const finalData = {
      ...formData,
      maxCapacity: formData.employmentType === 'part-time' ? 50 : 100,
    };
    createMutation.mutate(finalData);
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({...formData, skills: [...formData.skills, skill]});
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({...formData, skills: formData.skills.filter(skill => skill !== skillToRemove)});
  };

  const isLoading = createMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input 
            placeholder="John Doe" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input 
            type="email" 
            placeholder="john@company.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Seniority Level</label>
            <Select onValueChange={(value) => setFormData({...formData, seniority: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select seniority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intern">Intern</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid-level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select onValueChange={(value) => setFormData({...formData, department: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Full Stack">Full Stack</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Employment Type</label>
          <Select onValueChange={(value) => setFormData({...formData, employmentType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time (100% capacity)</SelectItem>
              <SelectItem value="part-time">Part-time (50% capacity)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <Select onValueChange={addSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Add a skill" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_SKILLS.filter(skill => !formData.skills.includes(skill)).map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
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

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Create Engineer"}
          </Button>
        </div>
      </form>
  );
}
