import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { LoginLinks } from "@/components/auth/LoginLinks";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailLoginForm
            onSuccess={handleLoginSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                O CONTINÚA CON
              </span>
            </div>
          </div>

          <GoogleLoginButton />
          <LoginLinks />
        </CardContent>
      </Card>
    </div>
  );
}