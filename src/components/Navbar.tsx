import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/9a1ab863-2777-4b3b-8815-847d697912d9.png" alt="Logo" className="h-8" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Últimas Reseñas</Link>
          <Link to="/cuenta-tu-experiencia" className="text-gray-600 hover:text-gray-900">Cuenta tu experiencia</Link>
          <Link to="/pathologies" className="text-gray-600 hover:text-gray-900">Buscar Patología</Link>
          <Link to="/add-pathology" className="text-gray-600 hover:text-gray-900">Insertar Patología</Link>
          <Link to="/symptoms" className="text-gray-600 hover:text-gray-900">Buscar Síntomas</Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" onClick={() => setOpen(false)} className="text-lg font-medium">Últimas Reseñas</Link>
                <Link to="/cuenta-tu-experiencia" onClick={() => setOpen(false)} className="text-lg font-medium">Cuenta tu experiencia</Link>
                <Link to="/pathologies" onClick={() => setOpen(false)} className="text-lg font-medium">Buscar Patología</Link>
                <Link to="/add-pathology" onClick={() => setOpen(false)} className="text-lg font-medium">Insertar Patología</Link>
                <Link to="/symptoms" onClick={() => setOpen(false)} className="text-lg font-medium">Buscar Síntomas</Link>
                <div className="pt-4 border-t">
                  <Link to="/login" onClick={() => setOpen(false)} className="block text-lg font-medium mb-3">Iniciar sesión</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="block text-lg font-medium text-primary">Registrarse</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex items-center space-x-4">
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