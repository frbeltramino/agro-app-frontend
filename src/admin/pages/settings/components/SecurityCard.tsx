import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "sonner";
import { PasswordInput } from "@/components/custom/CustomPasswordInput";

interface SecurityCardProps {
  title: string;
  description: string;
}

export const SecurityCard = ({ title, description }: SecurityCardProps) => {
  const { user, changePassword } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [formKey, setFormKey] = useState(0);

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
      setFormKey(k => k + 1);
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
        <form key={formKey} onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <PasswordInput
              id="current-password"
              name="current-password"
              label="Contraseña Actual"
              required
            />

          </div>

          <div className="space-y-2">
            <PasswordInput
              id="new-password"
              name="new-password"
              label="Nueva Contraseña"
              required
            />
          </div>

          <div className="space-y-2">
            <PasswordInput
              id="confirm-password"
              name="confirm-password"
              label="Confirmar Nueva Contraseña"
              required
            />
          </div>

          <Button type="submit" disabled={isPosting}>
            {isPosting ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
