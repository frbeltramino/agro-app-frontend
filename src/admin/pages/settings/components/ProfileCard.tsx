import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/auth/store/auth.store";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileCardProps {
  title: string;
  description: string;
}

export const ProfileCard = ({
  title,
  description,
}: ProfileCardProps) => {

  const { user, updateUserProfile } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const userId = user?.id.toString() || '';
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    console.log({ email, name });
    const isUserUpdated = await updateUserProfile(userId, name, email);

    if (isUserUpdated) {
      toast.success("Perfil actualizado correctamente");
      setIsPosting(false);
      return;
    }

    toast.error("Error al actualizar perfil");

    setIsPosting(false);

  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar + button */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage />
            <AvatarFallback className="bg-accent text-accent-foreground text-xl">
              {user?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Button variant="outline" onClick={() => { }}>
            Cambiar Foto
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder={user?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder={user?.email}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>


            <Button type="submit" disabled={isPosting}>
              Guardar Cambios
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
