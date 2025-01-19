import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import ReviewDetail from "./pages/ReviewDetail";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/review/:reviewId" element={<ReviewDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
