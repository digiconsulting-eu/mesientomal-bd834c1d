import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { LoginLinks } from "@/components/auth/LoginLinks";
import { Helmet } from 'react-helmet-async';

const ResetPassword = () => {
  return (
    <>
      <Helmet>
        <title>Restablecer Contraseña - MeSientoMal.info</title>
        <meta name="description" content="¿Olvidaste tu contraseña? Restablécela de forma segura para volver a acceder a tu cuenta en MeSientoMal.info" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Restablecer Contraseña</h1>
        <EmailLoginForm />
        <LoginLinks />
      </div>
    </>
  );
};

export default ResetPassword;
