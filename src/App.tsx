import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import PathologySearch from "./pages/PathologySearch";
import PathologyDetail from "./pages/PathologyDetail";
import ShareExperience from "./pages/ShareExperience";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pathologies" element={<PathologySearch />} />
              <Route path="/patologia/:name" element={<PathologyDetail />} />
              <Route 
                path="/cuenta-tu-experiencia" 
                element={
                  isAuthenticated ? (
                    <ShareExperience />
                  ) : (
                    <Navigate to="/login" state={{ from: "/cuenta-tu-experiencia" }} />
                  )
                } 
              />
              <Route 
                path="/login" 
                element={
                  !isAuthenticated ? (
                    <Login />
                  ) : (
                    <Navigate to="/" />
                  )
                } 
              />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;