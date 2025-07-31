import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TopbarProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, breadcrumbs, actions }: TopbarProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex-1">
        {breadcrumbs && (
          <nav className="flex mb-1" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="text-gray-400 text-xs mx-2">/</span>
                  )}
                  <span className={cn(
                    "text-sm",
                    index === breadcrumbs.length - 1 
                      ? "text-gray-900 font-medium" 
                      : "text-gray-500"
                  )}>
                    {breadcrumb.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-400" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>

        {/* Search */}
        <div className="hidden sm:block">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Custom actions */}
        {actions}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
