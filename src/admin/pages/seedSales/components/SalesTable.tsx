import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatDate } from "@/lib/format-date";
import { formatTn } from "@/lib/format-tn";
import { DollarSign, Trash2 } from "lucide-react";
import { useSalesActionsStore } from "../store/useSalesActionsStore";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";

interface SalesTableProps {
  sales: SeedSale[];
}

export function SalesTable({ sales }: SalesTableProps) {

  const { setSaleToDelete, openDeleteDialog } = useSalesActionsStore();

  if (sales.length === 0) {
    return (
      <CustomNoResultsCard
        title="No hay ventas registradas"
        message="Cuando registres ventas, aparecerán aquí."
        icon={DollarSign}
      />
    );
  }

  const totalTnSold = sales.reduce((sum, s) => sum + s.tn_sold, 0);
  const totalAmount = sales.reduce(
    (sum, s) => sum + s.tn_sold * s.price_per_tn,
    0
  );
  const avgPrice = totalTnSold > 0 ? totalAmount / totalTnSold : 0;

  const handleDeleteSale = (sale: SeedSale) => {
    setSaleToDelete(sale);
    openDeleteDialog();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº Liquidación</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead className="text-right">Fecha</TableHead>
            <TableHead className="text-right">Tn Vendidas</TableHead>
            <TableHead className="text-right">Precio/Tn</TableHead>

            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => {
            const total = sale.tn_sold * sale.price_per_tn;
            return (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  {sale.primary_liquidation_number}
                </TableCell>
                <TableCell>{sale.destination}</TableCell>
                <TableCell className="text-right">{formatDate(sale.sale_date)}</TableCell>
                <TableCell className="text-right">{formatTn(sale.tn_sold)} tn</TableCell>
                <TableCell className="text-right">{formatCurrency(sale.price_per_tn)}</TableCell>
                <TableCell className="text-right font-medium text-primary">
                  {formatCurrency(total)}
                </TableCell>
                <TableCell className="py-4 px-4 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSale(sale)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {/* Totales */}
          <TableRow className="bg-muted/50 font-medium">
            <TableCell>Total</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right">{formatTn(totalTnSold)} tn</TableCell>
            <TableCell className="text-right">Prom. {formatCurrency(avgPrice)}</TableCell>
            <TableCell className="text-right text-primary">{formatCurrency(totalAmount)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
