import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { LoginLinks } from "@/components/auth/LoginLinks";
import { Helmet } from 'react-helmet-async';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/"); // Redirect to home page after password update
  };

  return (
    <>
      <Helmet>
        <title>Actualizar Contraseña - MeSientoMal.info</title>
        <meta name="description" content="Actualiza tu contraseña de forma segura para proteger tu cuenta en MeSientoMal.info" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Actualizar Contraseña</h1>
        <EmailLoginForm 
          onSuccess={handleSuccess}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <LoginLinks />
      </div>
    </>
  );
};

export default UpdatePassword;