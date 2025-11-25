import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/products", label: "Productos", icon: Package },
    { path: "/sales", label: "Ventas", icon: ShoppingCart },
    { path: "/settings", label: "Configuración", icon: Settings },
  ];

  return (
    <nav className="bg-primary text-primary-foreground border-b border-sidebar-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold">Advance</span>
              <span className="text-2xl font-bold text-accent">Stock</span>
            </div>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={
                      isActive
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "text-primary-foreground hover:bg-sidebar-accent"
                    }
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
