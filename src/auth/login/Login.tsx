
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
      <Card className="w-full max-w-md bg-[#171318] text-white border border-white/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <CustomLogo />
          </div>
          <CardTitle className="text-2xl text-center text-white">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center text-white/70">
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
                className="
                  w-full rounded px-3 py-2
                  bg-white text-black
                  placeholder:text-gray-400
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:#333333"
              />
            </div>
            <div className="space-y-2">
              <PasswordInput
                id="password"
                name="password"
                label="Contraseña"
                placeholder="••••••••"
                required
                className="w-full rounded px-3 py-2
                  bg-white text-black
                  placeholder:text-gray-400
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:#333333"
              />
            </div>
            <Button
              type="submit"
              disabled={isPosting}
              className="w-full bg-[#d92727] hover:bg-[#d92727]/90 text-[#d92727]-foreground font-semibold py-5 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
            >
              {isPosting ? (
                <>
                  <div className="btn-loading-spinner mr-2" />
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
              className="text-white/70 hover:text-white hover:underline"
            >
              ¿Olvidaste tu contraseña? Recupera tu cuenta
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
