import { Button } from "@/components/ui/button";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatDate } from "@/lib/format-date";
import { formatTn } from "@/lib/format-tn";
import { DollarSign, Trash2 } from "lucide-react";
import { useSalesActionsStore } from "../store/useSalesActionsStore";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";
interface SalesMobileListProps {
  sales: SeedSale[];
}

export function SalesMobileList({ sales }: SalesMobileListProps) {

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
    <div className="space-y-3">
      {sales.map((sale) => {
        const total = sale.tn_sold * sale.price_per_tn;

        return (
          <div
            key={sale.id}
            className="rounded-lg border bg-card p-4 space-y-2"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="font-medium">
                Liquidación #{sale.primary_liquidation_number}
              </p>


              <div className="flex gap-1 justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDeleteSale(sale)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Fecha:
                </span> {" "}
                {formatDate(sale.sale_date)}
              </p>

              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Destino:</span>{" "}
                {sale.destination}
              </p>

              <p>
                <span className="font-medium">Tn vendidas:</span>{" "}
                {formatTn(sale.tn_sold)} tn
              </p>

              <p>
                <span className="font-medium">Precio / Tn:</span>{" "}
                {formatCurrency(sale.price_per_tn)}
              </p>

              <p className="flex justify-between font-medium text-primary pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </p>
            </div>
          </div>
        );
      })}

      {/* Totales */}
      <div className="rounded-lg border bg-muted/50 p-4 space-y-1 text-sm font-medium">
        <p className="flex justify-between">
          <span>Total Tn vendidas</span>
          <span>{formatTn(totalTnSold)} tn</span>
        </p>

        <p className="flex justify-between">
          <span>Precio promedio</span>
          <span>{formatCurrency(avgPrice)}</span>
        </p>

        <p className="flex justify-between text-primary">
          <span>Total</span>
          <span>${totalAmount.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}
