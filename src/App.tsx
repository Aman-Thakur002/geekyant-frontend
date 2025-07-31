import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Sidebar } from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import ManagerDashboard from "@/pages/manager/dashboard";
import ManagerEngineers from "@/pages/manager/engineers";
import ManagerProjects from "@/pages/manager/projects";
import ManagerAssignments from "@/pages/manager/assignments";
import TeamAnalytics from "@/pages/manager/analytics";
import CapacityPlanning from "@/pages/manager/capacity";
import TimelineView from "@/pages/manager/timeline";
import SkillGapAnalysis from "@/pages/manager/skill-gap";
import EngineerDashboard from "@/pages/engineer/dashboard";
import EngineerAssignments from "@/pages/engineer/assignments";
import EngineerProjects from "@/pages/engineer/projects";
import Profile from "@/pages/profile";

function DefaultRedirect() {
  const { user } = useAuth();
  const redirectPath = user?.type?.toLowerCase() === 'manager' ? '/manager' : '/engineer';
  console.log('DefaultRedirect - Redirecting to:', user?.type?.toLowerCase());
  return <Redirect to={redirectPath} replace />;
}

function AppRouter() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      
      {/* Manager Routes */}
      <Route path="/manager">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <ManagerDashboard />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager/engineers">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <ManagerEngineers />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager/projects">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <ManagerProjects />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager/assignments">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <ManagerAssignments />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager/analytics">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <TeamAnalytics />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager/capacity">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <CapacityPlanning />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager/timeline">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <TimelineView />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/manager/skill-gap">
        <ProtectedRoute requiredRole="manager">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <SkillGapAnalysis />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      {/* Engineer Routes */}
      <Route path="/engineer">
        <ProtectedRoute requiredRole="engineer">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <EngineerDashboard />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/engineer/assignments">
        <ProtectedRoute requiredRole="engineer">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <EngineerAssignments />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/engineer/projects">
        <ProtectedRoute requiredRole="engineer">
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <EngineerProjects />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      {/* Shared Routes */}
      <Route path="/profile">
        <ProtectedRoute>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64 flex-1 pt-16 lg:pt-0">
              <Profile />
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      {/* Default redirect */}
      <Route path="/">
        <ProtectedRoute>
          <DefaultRedirect />
        </ProtectedRoute>
      </Route>
      
      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
