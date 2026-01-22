import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Package } from "lucide-react";
import { formatTn } from "@/lib/format-tn";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { Badge } from "@/components/ui/badge";
import { formatDose } from "@/lib/format-dose";


interface SuppliesCardMobileProps {
  supplies: any[];
  onDelete: (supply: any) => void;
}

export const SuppliesCardMobile = ({ supplies, onDelete }: SuppliesCardMobileProps) => {

  if (!supplies || supplies.length === 0) {
    return <p className="text-muted-foreground">No se encontraron insumos</p>;
  }

  return (
    <div className="space-y-3">
      {supplies.map((s) => {
        const totalUsed = s.dose_per_ha * s.hectares
        const totalCost = totalUsed * (s.unit_price ?? 0)

        return (
          <Card key={s.supply_id ?? s.stock_id}>
            <CardContent className="pt-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                {/* Izquierda: texto */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="font-medium truncate">
                      {s.supply_name}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground truncate">
                    {s.category_name}
                  </p>
                </div>

                {/* Derecha: acciones (NO se mueven) */}
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={s.stock_id ? "secondary" : "outline"}>
                    {s.stock_id ? "Stock" : "Compra"}
                  </Badge>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onDelete(s)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Data grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Dosis / ha</p>
                  <p>
                    {formatDose(s.dose_per_ha)} {s.supply_unit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Hectáreas</p>
                  <p>{formatTn(s.hectares)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Total Usado</p>
                  <p>{formatDose(s.dose_per_ha * s.hectares)} {s.supply_unit}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Costo / u</p>
                  <p>{formatCurrency(s.unit_price ?? 0)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-medium">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
