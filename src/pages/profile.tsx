import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    seniority: user?.seniority || '',
    skills: user?.skills || []
  });

  // Update formData when user data changes or editing starts
  const startEditing = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      seniority: user?.seniority || '',
      skills: user?.skills || []
    });
    setIsEditing(true);
  };
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleSave = async () => {
    try {
      await authApi.updateProfile(user?._id || '', formData);
      updateUser({ ...user, ...formData } as any);
      setIsEditing(false);
      toast({ title: 'Profile updated successfully' });
    } catch (error: any) {
      toast({ title: 'Failed to update profile', description: error.message, variant: 'destructive' });
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => isEditing ? setIsEditing(false) : startEditing()}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input 
                    value={isEditing ? formData.name : user.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    value={user.email} 
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <Input 
                    value={user.type} 
                    disabled
                    className="mt-1"
                  />
                </div>
                {user.department && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <Input 
                      value={isEditing ? formData.department : user.department} 
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                )}
                {user.seniority && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Seniority</label>
                    {isEditing ? (
                      <Select value={formData.seniority} onValueChange={(value) => handleInputChange('seniority', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select seniority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intern">Intern</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="mid">Mid</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        value={user.seniority} 
                        disabled
                        className="mt-1"
                      />
                    )}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skills & Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(isEditing ? formData.skills : user?.skills || []).map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {isEditing && (
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-medium">{user.type}</span>
              </div>
              {user.type === 'Engineer' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max Capacity</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Utilization</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}