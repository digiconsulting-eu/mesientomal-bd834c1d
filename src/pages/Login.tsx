import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { LoginLinks } from "@/components/auth/LoginLinks";
import { Helmet } from 'react-helmet-async';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/"); // Redirect to home page on successful login
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - MeSientoMal.info</title>
        <meta name="description" content="Inicia sesión en MeSientoMal.info para compartir tus experiencias médicas y ayudar a otros pacientes." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Iniciar Sesión</h1>
          <EmailLoginForm 
            onSuccess={handleSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
            <div className="mt-4">
              <GoogleLoginButton />
            </div>
          </div>
          <LoginLinks />
        </div>
      </div>
    </>
  );
};

export default Login;