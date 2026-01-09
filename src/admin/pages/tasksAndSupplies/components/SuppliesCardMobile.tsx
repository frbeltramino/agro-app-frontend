import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Package } from "lucide-react";
import { currencyFormatter } from "@/lib/currency-formatter";
import { formatTn } from "@/lib/format-tn";


interface SuppliesCardMobileProps {
  supplies: any[];
  onDelete: (supply: any) => void;
}

export const SuppliesCardMobile = ({ supplies, onDelete }: SuppliesCardMobileProps) => {

  if (!supplies || supplies.length === 0) {
    return <p className="text-muted-foreground">No se encontraron suministros</p>;
  }

  return (
    <div className="space-y-4">
      {supplies.map((supply) => {
        const totalQuantity = supply.dose_per_ha * supply.hectares;

        return (
          <Card key={supply.supply_id!}>
            <CardHeader className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col gap-0.5 max-w-full">
                    <span className="font-medium wrap-break-words leading-tight">
                      {supply.supply_name}
                    </span>
                    <span
                      className="self-start w-fit max-w-full truncate"
                    >
                      {supply.category_name}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Dosis: {formatTn(supply.dose_per_ha)} {supply.supply_unit} • Cant/ha: {formatTn(supply.hectares)} • Total: {formatTn(totalQuantity)} {supply.supply_unit}
                </span>
                <span className="text-xs text-muted-foreground">
                  Precio unitario: {currencyFormatter(supply.unit_price ?? 0)} • Total: {currencyFormatter(totalQuantity * (supply.unit_price ?? 0))}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => onDelete(supply)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
