import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/auth/store/auth.store";

export const NewUserCard = () => {
  const [isPosting, setIsPosting] = useState(false);
  const { register } = useAuthStore();
  const [role, setRole] = useState("admin"); // valor por defecto

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement);

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    if (!email || !name || !password || !role) {
      toast.error("Todos los campos son obligatorios");
      setIsPosting(false);
      return;
    }

    const isValidNewUser = await register({
      email,
      password,
      name,
      roles: [role],
      status: true
    });
    if (isValidNewUser) {
      toast.success("Usuario creado correctamente");
      setIsPosting(false);
      (event.target as HTMLFormElement).reset();
      return;
    }

    toast.error("El usuario no pudo ser creado");
    setIsPosting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Usuario</CardTitle>
        <CardDescription>
          Registra un nuevo usuario en el sistema
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleCreateUser} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre del usuario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isPosting}>
            {isPosting ? "Creando..." : "Crear Usuario"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
