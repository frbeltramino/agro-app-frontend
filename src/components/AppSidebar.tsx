import { Home, Truck, Settings, LogOut, Flag, Warehouse, Receipt } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { CustomLogoSidebarDark } from "./custom/LogoSidebarDark";
import { CustomLogoSidebarLight } from "./custom/LogoSidebarLight";
import { CustomLogoMobile } from "./custom/CustomlogoMobile";
import { useAuthStore } from "@/auth/store/auth.store";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Campañas", url: "/admin/campaigns", icon: Flag },
  { title: "Control de Stock", url: "/admin/stock", icon: Warehouse },
  { title: "Venta de Semillas", url: "/admin/sales", icon: Truck },
  { title: "Gastos variables", url: "/admin/variable/expenses", icon: Receipt },
  { title: "Configuración", url: "/admin/settings", icon: Settings },

];

export function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user } = useAuthStore();
  const { theme } = useTheme();
  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    if (isMobile) setOpenMobile(false)
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader
        className={`h-20 border-b border-border flex items-center justify-center ${open ? "px-4" : "px-0"}`}
      >

        <div
          className={cn(
            "flex items-center justify-center w-full h-full transition-all duration-300 ease-in-out",
            open ? "h-16 px-3" : "h-12 px-1"
          )}
        >
          {theme === 'light' ?
            open ? <CustomLogoSidebarLight /> : <CustomLogoMobile />
            :
            open ? <CustomLogoSidebarDark /> : <CustomLogoMobile />
          }
        </div>
      </SidebarHeader>

      <SidebarContent>
        {open && user && (
          <div className="px-4 py-2">
            <p className="text-sm text-muted-foreground">
              Hola, <span className="font-medium text-foreground">{user.name || user.email?.split('@')[0]}</span>!👋
            </p>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false)
                      }}
                      className="flex items-center gap-3 hover:bg-accent-foreground/10"
                      activeClassName="bg-accent-foreground/20 text-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}