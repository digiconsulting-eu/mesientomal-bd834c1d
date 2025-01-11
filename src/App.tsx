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
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/cuenta-tu-experiencia" element={<ShareExperience />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;