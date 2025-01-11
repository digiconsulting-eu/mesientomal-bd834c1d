import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const GoogleLoginButton = () => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Se produjo un error durante el inicio de sesión con Google",
      });
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full h-[40px] px-6 flex items-center justify-center gap-3 border rounded-[4px] hover:bg-gray-50"
      onClick={handleGoogleLogin}
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="w-4 h-4"
      />
      Google
    </Button>
  );
};