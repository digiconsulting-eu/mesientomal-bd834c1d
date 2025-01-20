import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import ReviewDetail from "./pages/ReviewDetail";
import ShareExperience from "./pages/ShareExperience";
import PathologySearch from "./pages/PathologySearch";
import Admin from "./pages/Admin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

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
                <Route path="/:pathologyName/esperienza/:reviewTitle" element={<ReviewDetail />} />
                <Route path="/cuenta-tu-experiencia" element={<ShareExperience />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/recensioni" element={<div>Gestione Recensioni</div>} />
                <Route path="/admin/utenti" element={<div>Gestione Utenti</div>} />
                <Route path="/admin/importazione" element={<div>Importazione Dati</div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;