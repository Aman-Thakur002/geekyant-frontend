import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityItem } from '@/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-green-500';
      case 'project':
        return 'bg-blue-500';
      case 'engineer':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 mr-3`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
