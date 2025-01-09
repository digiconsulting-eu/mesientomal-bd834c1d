import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Index from "@/pages/Index";
import PathologySearch from "@/pages/PathologySearch";
import PathologyDetail from "@/pages/PathologyDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pathologies" element={<PathologySearch />} />
            <Route path="/pathology/:id" element={<PathologyDetail />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;