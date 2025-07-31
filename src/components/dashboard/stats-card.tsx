import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={cn(
              "flex items-center",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-500 ml-2">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
