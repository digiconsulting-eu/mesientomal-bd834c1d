import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { LoginLinks } from "@/components/auth/LoginLinks";
import { Helmet } from 'react-helmet-async';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Registro - MeSientoMal.info</title>
        <meta name="description" content="Únete a nuestra comunidad de pacientes. Regístrate para compartir tus experiencias y encontrar apoyo en personas con condiciones similares." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Registro</h1>
        <EmailLoginForm />
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
        <LoginLinks />
      </div>
    </>
  );
};

export default Register;
