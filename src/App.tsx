import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Index from "@/pages/Index";
import ShareExperience from "@/pages/ShareExperience";
import PathologySearch from "@/pages/PathologySearch";
import AddPathology from "@/pages/AddPathology";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/cuenta-tu-experiencia" element={<ShareExperience />} />
        <Route path="/pathologies" element={<PathologySearch />} />
        <Route path="/add-pathology" element={<AddPathology />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;