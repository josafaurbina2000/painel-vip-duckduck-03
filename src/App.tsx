
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VIPProvider } from "@/contexts/VIPContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import VIPList from "@/pages/VIPList";
import AddVIP from "@/pages/AddVIP";
import VIPDetails from "@/pages/VIPDetails";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <VIPProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300 w-full">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <Header />
                      <Navigation />
                      <main className="container mx-auto px-4 md:px-6 py-4 md:py-8">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/vips" element={<VIPList />} />
                          <Route path="/add-vip" element={<AddVIP />} />
                          <Route path="/vip/:id" element={<VIPDetails />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </BrowserRouter>
          </VIPProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
