import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Package, ShoppingCart, TrendingUp, Sprout } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";


const salesData = [
  { name: "Ene", ventas: 4000 },
  { name: "Feb", ventas: 3000 },
  { name: "Mar", ventas: 5000 },
  { name: "Abr", ventas: 4500 },
  { name: "May", ventas: 6000 },
  { name: "Jun", ventas: 5500 },
];

const productData = [
  { name: "Lun", productos: 20 },
  { name: "Mar", productos: 35 },
  { name: "Mié", productos: 28 },
  { name: "Jue", productos: 45 },
  { name: "Vie", productos: 38 },
  { name: "Sáb", productos: 52 },
  { name: "Dom", productos: 30 },
];

export const Dashboard = () => {
  const stats = [
    {
      title: "Ventas del Mes",
      value: "$148.5M",
      description: "+18.2% respecto al mes anterior",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Stock Total",
      value: "156 ton",
      description: "Semillas y productos disponibles",
      icon: Package,
      trend: "up",
    },
    {
      title: "Cultivos activos",
      value: "210 ha",
      description: "Hectáreas en producción",
      icon: Sprout,
      trend: "up",
    },
    {
      title: "Cosecha Estimada",
      value: "981.5 ton",
      description: "Producción total estimada",
      icon: ShoppingCart,
      trend: "up",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen de tu negocio y métricas principales"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            title={stat.title}
            value={stat.value}
            icon={<stat.icon className="h-4 w-4 text-muted-foreground" />}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
            <CardDescription>
              Resumen de ventas de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ventas" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos Vendidos</CardTitle>
            <CardDescription>
              Productos vendidos por día (última semana)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="productos"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

