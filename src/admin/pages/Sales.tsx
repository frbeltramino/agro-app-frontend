import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/PageHeader";

type Sale = {
  id: number;
  date: string;
  customer: string;
  products: number;
  total: number;
  status: "completed" | "pending" | "cancelled";
};

export const Sales = () => {
  const [sales] = useState<Sale[]>([
    { id: 1, date: "2024-01-15", customer: "Juan Pérez", products: 3, total: 1549.97, status: "completed" },
    { id: 2, date: "2024-01-15", customer: "María García", products: 1, total: 99.99, status: "completed" },
    { id: 3, date: "2024-01-14", customer: "Carlos López", products: 2, total: 599.98, status: "completed" },
    { id: 4, date: "2024-01-14", customer: "Ana Martínez", products: 1, total: 449.99, status: "pending" },
    { id: 5, date: "2024-01-13", customer: "Pedro Sánchez", products: 4, total: 379.96, status: "completed" },
  ]);

  const getStatusBadge = (status: Sale["status"]) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
    };
    const labels = {
      completed: "Completada",
      pending: "Pendiente",
      cancelled: "Cancelada",
    };
    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    );
  };

  const totalSales = sales
    .filter((s) => s.status === "completed")
    .reduce((acc, sale) => acc + sale.total, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Ventas"
          subtitle="  Registro y seguimiento de todas tus ventas"
        />
        <Button onClick={() => toast.info("Función de nueva venta próximamente")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas Totales
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {sales.filter(s => s.status === "completed").length} ventas completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Venta Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalSales / sales.filter(s => s.status === "completed").length).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por transacción
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales.reduce((acc, sale) => acc + sale.products, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de unidades
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>
            Todas las transacciones registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-sm">
                    #{sale.id.toString().padStart(4, "0")}
                  </TableCell>
                  <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{sale.customer}</TableCell>
                  <TableCell>{sale.products}</TableCell>
                  <TableCell className="font-bold">
                    ${sale.total.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(sale.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

