import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { LoginLinks } from "@/components/auth/LoginLinks";
import { Helmet } from 'react-helmet-async';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - MeSientoMal.info</title>
        <meta name="description" content="Inicia sesión en MeSientoMal.info para compartir tus experiencias médicas y ayudar a otros pacientes." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Iniciar Sesión</h1>
        <EmailLoginForm />
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
        <LoginLinks />
      </div>
    </>
  );
};

export default Login;
