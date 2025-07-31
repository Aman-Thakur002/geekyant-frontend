import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { engineersApi } from '@/lib/api';
import { EngineerForm } from '@/components/forms/engineer-form';
import { useToast } from '@/hooks/use-toast';

export default function ManagerEngineers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [debouncedSkillFilter, setDebouncedSkillFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, engineer: null });
  const [skillsModal, setSkillsModal] = useState({ open: false, engineer: null });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Debounce skill filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSkillFilter(skillFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [skillFilter]);

  const { data: engineersData, isLoading } = useQuery({
    queryKey: ['engineers', debouncedSkillFilter],
    queryFn: () => engineersApi.getAll(debouncedSkillFilter || undefined),
  });

  const engineers = Array.isArray(engineersData?.data) ? engineersData.data : Array.isArray(engineersData) ? engineersData : [];

  const filteredEngineers = engineers.filter(engineer =>
    engineer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteMutation = useMutation({
    mutationFn: engineersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engineers'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Engineer deleted successfully' });
      setDeleteConfirm({ open: false, engineer: null });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete engineer', description: error.message, variant: 'destructive' });
    },
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Engineers</h1>
          <p className="text-gray-600">Manage your engineering team</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Engineer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Engineer</DialogTitle>
            </DialogHeader>
            <EngineerForm 
              onSuccess={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search engineers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative sm:w-64">
              <Input
                placeholder="Filter by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="pr-8"
              />
              {skillFilter && (
                <X 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" 
                  onClick={() => setSkillFilter('')}
                />
              )}
            </div>
          </div>
          {debouncedSkillFilter && (
            <div className="text-sm text-gray-600 mt-2">
              Showing engineers with skill: <Badge variant="secondary">{debouncedSkillFilter}</Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEngineers.map((engineer) => (
              <div key={engineer._id} className="border rounded-lg p-4 space-y-4">
                {/* Mobile and Desktop Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-medium text-gray-700">
                        {engineer.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{engineer.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{engineer.email}</p>
                      <p className="text-sm text-gray-500 hidden sm:block">
                        {engineer.department} • {engineer.seniority} • {engineer.employmentType}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm({ open: true, engineer })}
                    className="text-red-600 hover:text-red-700 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Details */}
                <div className="sm:hidden space-y-2">
                  <p className="text-sm text-gray-500">
                    {engineer.department} • {engineer.seniority} • {engineer.employmentType}
                  </p>
                </div>

                {/* Capacity and Skills Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">Capacity</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${((engineer.currentAllocation || 0) / (engineer.maxCapacity || 100)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-[35px] text-right">{engineer.currentAllocation || 0}%</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 sm:max-w-[250px]">
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {engineer.skills?.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {engineer.skills && engineer.skills.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-gray-100"
                          onClick={() => setSkillsModal({ open: true, engineer })}
                        >
                          +{engineer.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open, engineer: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Engineer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{deleteConfirm.engineer?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm({ open: false, engineer: null })}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteMutation.mutate(deleteConfirm.engineer?._id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
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