import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/9a1ab863-2777-4b3b-8815-847d697912d9.png" alt="Logo" className="h-8" />
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Últimas Reseñas</Link>
          <Link to="/cuenta-tu-experiencia" className="text-gray-600 hover:text-gray-900">Cuenta tu experiencia</Link>
          <Link to="/pathologies" className="text-gray-600 hover:text-gray-900">Buscar Patología</Link>
          <Link to="/add-pathology" className="text-gray-600 hover:text-gray-900">Insertar Patología</Link>
          <Link to="/symptoms" className="text-gray-600 hover:text-gray-900">Buscar Síntomas</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Iniciar sesión</Button>
          </Link>
          <Link to="/register">
            <Button>Registrarse</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};