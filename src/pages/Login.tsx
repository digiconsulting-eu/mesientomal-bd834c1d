import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Accedi o Registrati</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Accedi",
                  loading_button_label: "Accesso in corso...",
                  social_provider_text: "Accedi con {{provider}}",
                  link_text: "Hai già un account? Accedi",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Registrati",
                  loading_button_label: "Registrazione in corso...",
                  social_provider_text: "Registrati con {{provider}}",
                  link_text: "Non hai un account? Registrati",
                },
                magic_link: {
                  button_label: "Invia link magico",
                  loading_button_label: "Invio link in corso...",
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;