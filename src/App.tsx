import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
// import Login from "./pages/Login";
import { Dashboard } from "./admin/pages/Dashboard";
import { Login } from "./auth/login/Login";
import { Sales } from "./admin/pages/Sales";
import { Settings } from "./admin/pages/settings/page/Settings";
import { Crops } from "./admin/pages/crops/page/Crops";
import { Campaigns } from "./admin/pages/campaigns/page/Campaings";

import { CustomFullScreenLoading } from "./components/custom/CustomFullScreenLoading";
import { useAuthStore } from "./auth/store/auth.store";
import { TasksAndSupplies } from "./admin/pages/tasksAndSupplies/page/TasksAndSupplies";
import { Lots } from "./admin/pages/lots/page/Lots";

const queryClient = new QueryClient();

const PrivateRouteWithSidebar = ({ children }: { children: React.ReactNode }) => {

  const { checkAuthStatus, isAuthenticated } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true
  });

  if (isLoading) return <CustomFullScreenLoading />;

  if (isAuthenticated !== 'authenticated') {
    return <Navigate to="/auth/login" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-20 border-b border-border flex items-center px-4 bg-background">
            <SidebarTrigger />
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const SmartRedirect = () => {
  const { checkAuthStatus, isAuthenticated } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true
  });

  if (isLoading) return <CustomFullScreenLoading />;

  return isAuthenticated === "authenticated"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/auth/login" />;
};

export const App = () => (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRouteWithSidebar>
                <Dashboard />
              </PrivateRouteWithSidebar>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <PrivateRouteWithSidebar>
                <Sales />
              </PrivateRouteWithSidebar>
            }
          />
          <Route
            path="/admin/campaigns"
            element={
              <PrivateRouteWithSidebar>
                <Campaigns />
              </PrivateRouteWithSidebar>
            }
          />
          <Route
            path="/admin/campaigns/:campaignId/lots"
            element={
              <PrivateRouteWithSidebar>
                <Lots />
              </PrivateRouteWithSidebar>
            }
          />
          <Route
            path="/admin/campaigns/:campaignId/lots/:lotId/crops"
            element={
              <PrivateRouteWithSidebar>
                <Crops />
              </PrivateRouteWithSidebar>
            }
          />
          <Route
            path="/admin/campaigns/:campaignId/lots/:lotId/crops/:cropId/TasksAndSupplies"
            element={
              <PrivateRouteWithSidebar>
                <TasksAndSupplies />
              </PrivateRouteWithSidebar>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRouteWithSidebar>
                <Settings />
              </PrivateRouteWithSidebar>
            }
          />
          <Route path="*" element={<SmartRedirect />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
