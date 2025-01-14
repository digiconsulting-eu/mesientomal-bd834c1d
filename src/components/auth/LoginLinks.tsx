import { Link } from "react-router-dom";

export const LoginLinks = () => {
  return (
    <div className="mt-4 text-center space-y-2">
      <Link
        to="/restablecer-contrasena"
        className="text-sm text-blue-500 hover:underline block"
      >
        ¿Olvidaste tu contraseña?
      </Link>
      <div className="text-sm">
        ¿No tienes una cuenta?{" "}
        <Link to="/registro" className="text-blue-500 hover:underline">
          Regístrate
        </Link>
      </div>
    </div>
  );
};