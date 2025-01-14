import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from "@/components/Navbar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Index from "@/pages/Index";
import ShareExperience from "@/pages/ShareExperience";
import PathologySearch from "@/pages/PathologySearch";
import PathologyDetail from "@/pages/PathologyDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/iniciar-sesion" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/restablecer-contrasena" element={<ResetPassword />} />
            <Route path="/actualizar-contrasena" element={<UpdatePassword />} />
            <Route path="/cuenta-tu-experiencia" element={<ShareExperience />} />
            <Route path="/patologias" element={<PathologySearch />} />
            <Route path="/patologia/:name" element={<PathologyDetail />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;