
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import ReviewDetail from "./pages/ReviewDetail";
import ShareExperience from "./pages/ShareExperience";
import PathologySearch from "./pages/PathologySearch";
import PathologyDetail from "./pages/PathologyDetail";
import LatestReviews from "./pages/LatestReviews";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Configure React Query with proper settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/patologias" element={<PathologySearch />} />
                <Route path="/patologia/:name" element={<PathologyDetail />} />
                <Route path="/ultimas-resenas" element={<LatestReviews />} />
                <Route path="/patologia/:pathologyName/esperienza/:reviewTitle" element={<ReviewDetail />} />
                <Route path="/cuenta-tu-experiencia" element={<ShareExperience />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/recensioni" element={<div>Gestione Recensioni</div>} />
                <Route path="/admin/utenti" element={<div>Gestione Utenti</div>} />
                <Route path="/admin/importazione" element={<div>Importazione Dati</div>} />
                <Route path="/iniciar-sesion" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="*" element={
                  <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Página no encontrada</h1>
                    <p className="text-gray-600 mb-8">Lo sentimos, la página que buscas no existe.</p>
                    <a href="/" className="text-blue-500 hover:text-blue-600">
                      Volver a la página principal
                    </a>
                  </div>
                } />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
