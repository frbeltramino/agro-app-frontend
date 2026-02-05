import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



import { PageHeader } from "../../../components/PageHeader";
import { ProfileCard } from "../components/ProfileCard";
import { PreferencesCard } from "../components/PreferencesCard";
import { SecurityCard } from "../components/SecurityCard";

export const Settings = () => {

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Configuración"
        subtitle="Administra tu perfil y preferencias de la aplicación"
      />
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        {/* PERFIL */}
        <TabsContent value="profile" className="space-y-4">
          <ProfileCard
            title="Información del Perfil"
            description="Actualiza tu información personal"
          />
        </TabsContent>

        {/* PREFERENCIAS */}
        <TabsContent value="preferences" className="space-y-4">
          <PreferencesCard />
        </TabsContent>

        {/* SEGURIDAD */}
        <TabsContent value="security" className="space-y-4">
          <SecurityCard
            title="Seguridad"
            description="Gestiona tu contraseña"
          />
        </TabsContent>

      </Tabs>
    </div>
  );
};
