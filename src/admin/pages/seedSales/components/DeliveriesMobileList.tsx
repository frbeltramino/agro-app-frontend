
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";
import { formatDate } from "@/lib/format-date";
import { formatTn } from "@/lib/format-tn";
import { Trash2, Truck } from "lucide-react";
import { useDeliveriesActionsStore } from "../store/useDeliveriesActionsStore";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";


interface DeliveriesMobileListProps {
  deliveries: Delivery[];
}

const statusLabels: Record<string, string> = {
  partial: "Parcial",
  complete: "Completo",
  pending: "Pendiente",
};

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  partial: "secondary",
  complete: "default",
  pending: "outline",
};

export function DeliveriesMobileList({
  deliveries,
}: DeliveriesMobileListProps) {

  const { setDeliveryToDelete, openDeleteDialog } = useDeliveriesActionsStore();

  const handleDeleteDelivery = (delivery: Delivery) => {
    setDeliveryToDelete(delivery);
    openDeleteDialog();
  }

  if (deliveries.length === 0) {
    return (
      <CustomNoResultsCard
        title="No hay ventas registradas"
        message="Cuando registres ventas, aparecerán aquí."
        icon={Truck}
      />
    );
  }

  return (
    <div className="space-y-3">
      {deliveries.map((delivery) => (
        <div
          key={delivery.id}
          className="rounded-lg border bg-card p-4 space-y-2"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="font-medium">
              Carta #{delivery.waybill_number}
            </p>


            <div className="flex gap-1 justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  handleDeleteDelivery(delivery)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Estado:</span>{" "}
              <Badge variant={statusVariants[delivery.status]}>
                {statusLabels[delivery.status]}
              </Badge>
            </p>
            <p>
              <span className="font-medium text-foreground">Destino:</span>{" "}
              {delivery.destination}
            </p>

            <p>
              <span className="font-medium text-foreground">
                Tn entregadas:
              </span>{" "}
              {formatTn(delivery.tn_delivered)} tn
            </p>

            <p>
              <span className="font-medium text-foreground">Fecha:</span>{" "}
              {formatDate(delivery.delivery_date)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
