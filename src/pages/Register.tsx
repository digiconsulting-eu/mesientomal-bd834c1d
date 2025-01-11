import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Le password non corrispondono");
      return;
    }

    if (!acceptTerms) {
      toast.error("Devi accettare i termini e le condizioni");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            birth_year: parseInt(birthYear),
            gender,
          },
        },
      });

      if (error) throw error;

      toast.success("Registrazione completata con successo! Controlla la tua email per confermare l'account.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate birth year options from 1924 to current year
  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from(
    { length: currentYear - 1923 },
    (_, i) => currentYear - i
  );

  return (
    <div className="container max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Registrati</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="La tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Scegli una password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Conferma Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Conferma la password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthYear">Anno di Nascita</Label>
          <Select value={birthYear} onValueChange={setBirthYear}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona anno" />
            </SelectTrigger>
            <SelectContent>
              {birthYearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Sesso</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona sesso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Maschio</SelectItem>
              <SelectItem value="F">Femmina</SelectItem>
              <SelectItem value="O">Altro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Acconsento al trattamento dei dati personali da parte dei Titolari,
            per finalità di profilazione a scopi commerciali.{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registrazione in corso..." : "Registrati"}
        </Button>

        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OPPURE CONTINUA CON
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth/callback`
              }
            })}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-4 h-4 mr-2"
            />
            Google
          </Button>
        </div>

        <p className="text-center text-sm">
          Hai già un account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Accedi
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;