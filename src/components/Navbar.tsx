import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      return roleData?.role === 'admin';
    }
  });

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/5d31e0b1-6cd5-4054-8bc5-a570b5b85b57.png" 
            alt="MeSientoMal.info" 
            className="h-10 w-auto object-contain" 
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-[#3B9EE3]">Últimas Reseñas</Link>
          <Link to="/cuenta-tu-experiencia" className="text-gray-600 hover:text-[#3B9EE3]">Cuenta tu Experiencia</Link>
          <Link to="/patologias" className="text-gray-600 hover:text-[#3B9EE3]">Buscar Patología</Link>
          <Link to="/agregar-patologia" className="text-gray-600 hover:text-[#3B9EE3]">Añadir Patología</Link>
          <Link to="/sintomas" className="text-gray-600 hover:text-[#3B9EE3]">Buscar Síntomas</Link>
          {isAdmin && (
            <Link to="/admin" className="text-gray-600 hover:text-[#3B9EE3]">Admin</Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" onClick={() => setOpen(false)} className="text-lg font-medium">Últimas Reseñas</Link>
                <Link to="/cuenta-tu-experiencia" onClick={() => setOpen(false)} className="text-lg font-medium">Cuenta tu Experiencia</Link>
                <Link to="/patologias" onClick={() => setOpen(false)} className="text-lg font-medium">Buscar Patología</Link>
                <Link to="/agregar-patologia" onClick={() => setOpen(false)} className="text-lg font-medium">Añadir Patología</Link>
                <Link to="/sintomas" onClick={() => setOpen(false)} className="text-lg font-medium">Buscar Síntomas</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="text-lg font-medium">Admin</Link>
                )}
                <div className="pt-4 border-t">
                  <Link to="/iniciar-sesion" onClick={() => setOpen(false)} className="block text-lg font-medium mb-3">Iniciar Sesión</Link>
                  <Link to="/registro" onClick={() => setOpen(false)} className="block text-lg font-medium text-[#3B9EE3]">Registrarse</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/iniciar-sesion">
            <Button variant="ghost">Iniciar Sesión</Button>
          </Link>
          <Link to="/registro">
            <Button>Registrarse</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};