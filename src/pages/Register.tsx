
import { Helmet } from 'react-helmet-async';
import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { RegisterDivider } from "@/components/auth/RegisterDivider";

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Registro - MeSientoMal.info</title>
        <meta 
          name="description" 
          content="Únete a nuestra comunidad de pacientes. Regístrate para compartir tus experiencias y encontrar apoyo en personas con condiciones similares." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Registro</h1>
          
          <RegisterForm />
          <RegisterDivider />
          <GoogleLoginButton />
        </div>
      </div>
    </>
  );
};

export default Register;
