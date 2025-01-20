import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import ReviewDetail from "./pages/ReviewDetail";
import ShareExperience from "./pages/ShareExperience";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/:pathologyName/esperienza/:reviewTitle" element={<ReviewDetail />} />
              <Route path="/cuenta-tu-experiencia" element={<ShareExperience />} />
            </Routes>
          </main>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;