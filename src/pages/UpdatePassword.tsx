import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { LoginLinks } from "@/components/auth/LoginLinks";
import { Helmet } from 'react-helmet-async';

const UpdatePassword = () => {
  return (
    <>
      <Helmet>
        <title>Actualizar Contraseña - MeSientoMal.info</title>
        <meta name="description" content="Actualiza tu contraseña de forma segura para proteger tu cuenta en MeSientoMal.info" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Actualizar Contraseña</h1>
        <EmailLoginForm />
        <LoginLinks />
      </div>
    </>
  );
};

export default UpdatePassword;
