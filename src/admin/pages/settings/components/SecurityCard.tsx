import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "sonner";

interface SecurityCardProps {
  title: string;
  description: string;
}

export const SecurityCard = ({ title, description }: SecurityCardProps) => {
  const { user, changePassword } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const userId = user?.id.toString() || '';
    const formData = new FormData(event.target as HTMLFormElement);

    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    //comparar newPassword confirmPassword
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setIsPosting(false);
      return;
    }

    const isPasswordChanged = await changePassword(userId, currentPassword, newPassword);


    if (isPasswordChanged) {
      toast.success("Contraseña actualizada correctamente");
      setIsPosting(false);
      return;
    }

    toast.error("Error al actualizar contraseña");

    setIsPosting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña Actual</Label>
            <Input id="current-password" name="current-password" type="password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <Input id="new-password" name="new-password" type="password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
            <Input id="confirm-password" name="confirm-password" type="password" required />
          </div>

          <Button type="submit" disabled={isPosting}>
            {isPosting ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
