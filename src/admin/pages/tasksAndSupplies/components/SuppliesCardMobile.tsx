import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Package } from "lucide-react";
import { currencyFormatter } from "@/lib/currency-formatter";
import { formatTn } from "@/lib/format-tn";
import { useState } from "react";

interface SuppliesCardMobileProps {
  supplies: any[];
  onDelete: (supply: any) => void;
}

export const SuppliesCardMobile = ({ supplies, onDelete }: SuppliesCardMobileProps) => {
  const [expandedSupplies, setExpandedSupplies] = useState<number[]>([]);

  const toggleSupply = (id: number) => {
    setExpandedSupplies(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!supplies || supplies.length === 0) {
    return <p className="text-muted-foreground">No se encontraron suministros</p>;
  }

  return (
    <div className="space-y-4">
      {supplies.map((supply) => {
        const isOpen = expandedSupplies.includes(supply.supply_id!);
        const totalQuantity = supply.dose_per_ha * supply.hectares;

        return (
          <Card key={supply.supply_id!}>
            <CardHeader className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleSupply(supply.supply_id!)}
                  >
                    {isOpen ? <Package className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                  </Button>
                  <span className="font-medium">{supply.supply_name}</span>
                  <Badge variant="outline">{supply.category_name}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  Dosis: {formatTn(supply.dose_per_ha)} {supply.supply_unit} • Cant/ha: {formatTn(supply.hectares)} • Total: {formatTn(totalQuantity)} {supply.supply_unit}
                </span>
                <span className="text-xs text-muted-foreground">
                  Precio unitario: {currencyFormatter(supply.unit_price)} • Total: {currencyFormatter(totalQuantity * supply.unit_price)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => onDelete(supply)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {isOpen && (
              <CardContent className="pt-0">
                {/* Aquí podés agregar más detalles si el suministro tiene info adicional */}
                <p className="text-sm text-muted-foreground">Detalles adicionales del suministro...</p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
