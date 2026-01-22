import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatTn } from "@/lib/format-tn";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatDose } from "@/lib/format-dose";

interface SuppliesCardDesktopProps {
  supplies: any[];
  onDelete: (supply: any) => void;
  calculateTotalCostBySupply: (unitPrice: number, quantity: number) => string;
  handleCheckUsageSupply: (supply: any) => void;
}

export const SuppliesCardDesktop = ({
  supplies,
  calculateTotalCostBySupply,
  handleCheckUsageSupply,
}: SuppliesCardDesktopProps) => {

  if (!supplies || supplies.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Insumo</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Dosis/ha</TableHead>
          <TableHead>Cant/h</TableHead>
          <TableHead>Total Usado</TableHead>
          <TableHead>Precio unitario</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supplies.map((supply, index) => {
          const totalQuantity = (supply.dose_per_ha ?? 0) * (supply.hectares ?? 0);
          return (
            <TableRow key={supply.supply_id ?? `supply-${index}`}>
              <TableCell className="font-medium">{supply.supply_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{supply.category_name}</Badge>
              </TableCell>
              <TableCell>{formatDose(supply.dose_per_ha)} {supply.supply_unit}</TableCell>
              <TableCell>{formatTn(supply.hectares)}</TableCell>
              <TableCell>{formatDose(totalQuantity)} {supply.supply_unit}</TableCell>
              <TableCell>{formatCurrency(supply.unit_price ?? 0)}</TableCell>
              <TableCell className="font-medium">
                {calculateTotalCostBySupply(supply.unit_price ?? 0, totalQuantity)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCheckUsageSupply(supply)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
