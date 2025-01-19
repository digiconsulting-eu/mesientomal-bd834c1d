import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import ReviewDetail from "./pages/ReviewDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/review/:reviewId" element={<ReviewDetail />} />
          </Routes>
        </main>
      </Router>
    </QueryClientProvider>
  );
}

export default App;