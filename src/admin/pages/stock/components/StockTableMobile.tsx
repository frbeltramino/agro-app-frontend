import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Package } from "lucide-react";
import { currencyFormatter } from "@/lib/currency-formatter";
import { formatKg } from "@/lib/format-kg";
import { useState } from "react";
import { Stock } from "@/interfaces/stock/stock.interface";

interface StockCardMobileProps {
  stock: Stock[];
  onEdit: (item: Stock) => void;
  onDelete: (item: Stock) => void;
}

export const StockTableMobile = ({ stock, onEdit, onDelete }: StockCardMobileProps) => {
  const [expanded, setExpanded] = useState<number[]>([]);

  const toggle = (id: number) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!stock || stock.length === 0) {
    return <p className="text-muted-foreground">No se encontraron suministros</p>;
  }

  const getStockLevelBadge = (quantity: number) => {
    if (quantity > 20) return <Badge className="bg-green-600">Alto</Badge>;
    if (quantity > 10) return <Badge className="bg-yellow-600">Medio</Badge>;
    return <Badge className="bg-red-600">Bajo</Badge>;
  };

  const getStatusBadge = (status: string) => (
    <Badge variant={status === "active" ? "default" : "secondary"}>
      {status === "active" ? "Activo" : "Inactivo"}
    </Badge>
  );

  return (
    <div className="space-y-4">
      {stock.map(item => {
        const isOpen = expanded.includes(item.id ? item.id : 0);

        return (
          <Card key={item.id}>
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggle(item.id ? item.id : 0)}
                  >
                    <Package className="h-4 w-4" />
                  </Button>

                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category_name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(item)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {getStockLevelBadge(item.quantity_available)}
                {getStatusBadge(item.status)}
              </div>

              <p className="text-sm text-muted-foreground">
                Cantidad: {formatKg(item.quantity_available)} {item.unit}
              </p>
            </CardHeader>

            {isOpen && (
              <CardContent className="pt-0 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Precio unitario</span>
                  <span className="font-medium">
                    {currencyFormatter(item.price_per_unit)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Vencimiento</span>
                  <span>
                    {item.expiration_date
                      ? new Date(item.expiration_date).toLocaleDateString()
                      : "Sin vencimiento"}
                  </span>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
