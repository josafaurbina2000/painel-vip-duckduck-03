
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { VIPProvider } from "@/contexts/VIPContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import VIPList from "@/pages/VIPList";
import AddVIP from "@/pages/AddVIP";
import VIPDetails from "@/pages/VIPDetails";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Main App Layout component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-background bg-gradient-to-b from-muted/20 to-transparent text-foreground transition-colors duration-300 w-full">
    <Header />
    <Navigation />
    <main className="container mx-auto px-4 md:px-6 py-4 md:py-8">
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <VIPProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vips"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <VIPList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-vip"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AddVIP />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vip/:id"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <VIPDetails />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </VIPProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
