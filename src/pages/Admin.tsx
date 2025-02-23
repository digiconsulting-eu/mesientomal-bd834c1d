import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

export default function Admin() {
  const navigate = useNavigate();

  // Check if user is admin
  const { data: userRole, isLoading } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      return roleData?.role;
    }
  });

  useEffect(() => {
    if (!isLoading && userRole !== 'admin') {
      navigate('/');
    }
  }, [userRole, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Caricamento...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Area Amministrazione - MeSientoMal.info</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Area Amministrazione</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Gestione Recensioni */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Gestione Recensioni</h2>
            <p className="text-gray-600">
              Gestisci le recensioni degli utenti, approva o rimuovi contenuti.
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/recensioni')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Vai a Gestione Recensioni
            </Button>
          </Card>

          {/* Gestione Utenti */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Gestione Utenti</h2>
            <p className="text-gray-600">
              Visualizza e gestisci gli utenti registrati sulla piattaforma.
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/utenti')}
            >
              <Users className="mr-2 h-4 w-4" />
              Vai a Gestione Utenti
            </Button>
          </Card>

          {/* Importazione Dati */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Importazione Dati</h2>
            <p className="text-gray-600">
              Importa recensioni e descrizioni delle patologie da file Excel.
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/importazione')}
            >
              <Upload className="mr-2 h-4 w-4" />
              Vai a Importazione
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
