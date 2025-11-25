import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export const PreferencesCard = () => {

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSavePreferences = () => {
    toast.success("Preferencias guardadas correctamente");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferencias</CardTitle>
        <CardDescription>Personaliza tu experiencia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Notificaciones</Label>
            <p className="text-sm text-muted-foreground">
              Recibe notificaciones sobre ventas y actualizaciones
            </p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Modo Oscuro</Label>
            <p className="text-sm text-muted-foreground">
              Cambia entre tema claro y oscuro
            </p>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <Button onClick={handleSavePreferences}>
          Guardar Preferencias
        </Button>
      </CardContent>
    </Card>
  );
};
