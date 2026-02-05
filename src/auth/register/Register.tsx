"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CustomLogo } from "@/components/custom/CustomLogo";
import { PasswordInput } from "@/components/custom/CustomPasswordInput";
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useOtp } from "@/admin/hooks/useOtp"
import { useAuthStore } from "../store/auth.store"
import { useOtpVerify } from "@/admin/hooks/useOtpVerify"
import { useNavigate } from "react-router-dom";

type FormState = "email" | "otp"

export function Register() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { createAndSendOtp } = useOtp()
  const { mutateAsync: verifyOtp } = useOtpVerify();
  const { register } = useAuthStore()

  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa tu email o usuario",
      });
      return;
    }

    setIsLoading(true);

    try {
      await createAndSendOtp.mutateAsync({ email });
      toast({
        title: "Código enviado",
        description: "Revisa tu correo electrónico para obtener el código OTP",
      });
      setFormState("otp");
    } catch (error: any) {
      // Opcional: si quieres asegurar que siempre se muestre algo
      const message =
        error?.response?.data?.message || error?.message || "No se pudo enviar el código";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleCreateAccount = async () => {
    // 1️⃣ Validaciones
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa tu nombre",
      });
      return;
    }

    if (!otp.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa el código OTP",
      });
      return;
    }

    if (!password.trim() || password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 2️⃣ Verificar OTP en backend
      await verifyOtp({ email, otp });

      // 3️⃣ Registrar usuario y loguearlo automáticamente
      const success = await register({
        email,
        password,
        name,
        roles: ["admin"], // o los roles que correspondan
        status: true,     // o false según tu lógica
      });

      if (!success) {
        throw new Error("Error al crear la cuenta");
      }

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada correctamente",
      });

      // 4️⃣ Redirigir al dashboard
      navigate("/admin/dashboard");

      // 5️⃣ Reset opcional del formulario si quieres limpiar campos
      setFormState("email");
      setEmail("");
      setName("");
      setOtp("");
      setPassword("");
      setName("");

    } catch (error: any) {
      console.error("Error creando cuenta:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ocurrió un error. Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setFormState("email")
    setOtp("")
    setPassword("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <Card className="w-full max-w-md bg-[#171318] border-white/10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <CustomLogo />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white">
              {formState === "email" ? "Crear cuenta" : "Verificar código"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {formState === "email"
                ? "Ingresa tu email para recibir un código de verificación"
                : "Ingresa el código OTP y crea tu contraseña"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formState === "email" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email o Usuario
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white text-black placeholder:text-gray-500 border-gray-300"
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full bg-[#d92727] hover:bg-[#b82020] text-white transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar código OTP"
                )}
              </Button>
              <Button
                onClick={() => navigate("/auth/login")}
                className="w-full  text-black transition-all duration-200"
              >
                Volver
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-display" className="text-white">
                  Email
                </Label>
                <Input
                  id="email-display"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100 text-gray-600 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white">
                  Código OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Ingresa el código de 6 dígitos"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  maxLength={6}
                  className="
    bg-[#1f1b2e]          /* fondo oscuro similar a la card */
    text-white            /* letras blancas */
    placeholder:text-gray-400
    border-gray-600       /* borde tenue */
     focus-visible:ring-white
    focus:border-[#d92727]
  "
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nombre
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="
    bg-[#1f1b2e]          /* fondo oscuro similar a la card */
    text-white            /* letras blancas */
    placeholder:text-gray-400
    border-gray-600       /* borde tenue */
     focus-visible:ring-white
    focus:border-[#d92727]
  "
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Crear contraseña
                </Label>
                <PasswordInput
                  id="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleCreateAccount}
                  disabled={isLoading}
                  className="w-full bg-[#d92727] hover:bg-[#b82020] text-white transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Ingresar / Crear cuenta"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="w-full text-gray-400 hover:text-black hover:bg-white transition-all duration-200"
                >
                  Volver
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
