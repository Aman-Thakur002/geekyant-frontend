import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import { assignmentsApi } from '@/lib/api';
import { AssignmentForm } from '@/components/forms/assignment-form';
import { useToast } from '@/hooks/use-toast';

export default function ManagerAssignments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, assignment: null });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentsApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: assignmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['engineers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Assignment deleted successfully' });
      setDeleteConfirm({ open: false, assignment: null });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete assignment', description: error.message, variant: 'destructive' });
    },
  });

  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : Array.isArray(assignmentsData) ? assignmentsData : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Manage engineer assignments to projects</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <AssignmentForm 
              onSuccess={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {assignment.engineerId?.name || 'Engineer'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {assignment.projectId?.name || 'Project'} • {assignment.role}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{assignment.allocationPercentage}% allocated</p>
                    <p className="text-sm text-gray-500">
                      {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditAssignment(assignment)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirm({ open: true, assignment })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {assignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No assignments found. Create your first assignment to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Assignment Modal */}
      <Dialog open={!!editAssignment} onOpenChange={(open) => !open && setEditAssignment(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
          </DialogHeader>
          <AssignmentForm 
            assignment={editAssignment}
            onSuccess={() => setEditAssignment(null)}
            onCancel={() => setEditAssignment(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open, assignment: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete the assignment for <strong>{deleteConfirm.assignment?.engineerId?.name}</strong> on <strong>{deleteConfirm.assignment?.projectId?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm({ open: false, assignment: null })}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteMutation.mutate(deleteConfirm.assignment?._id)}
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