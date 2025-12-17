
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomLogo } from "@/components/custom/CustomLogo";

import { useAuthStore } from "../store/auth.store";
import { PasswordInput } from "@/components/custom/CustomPasswordInput";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const isValid = await login(email, password);

    if (isValid) {
      toast.success("¡Bienvenido!");
      navigate("/admin/dashboard");
      return;
    }

    toast.error("Email o contraseña incorrectos");

    setIsPosting(false);

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <CustomLogo />
          </div>
          <CardTitle className="text-2xl text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="space-y-2">
              <PasswordInput
                id="password"
                name="password"
                label="Contraseña"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isPosting}>
              {isPosting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => { }}
              className="text-accent-foreground hover:underline"
            >
              ¿Olvidaste tu contraseña? Recupera tu cuenta
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
