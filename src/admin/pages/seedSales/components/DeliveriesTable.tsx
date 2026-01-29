import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";
import { formatDate } from "@/lib/format-date";
import { formatTn } from "@/lib/format-tn";
import { Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeliveriesActionsStore } from "../store/useDeliveriesActionsStore";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";

interface DeliveriesTableProps {
  deliveries: Delivery[];
}

const statusLabels: Record<string, string> = {
  partial: "Parcial",
  complete: "Completo",
  pending: "Pendiente",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  partial: "secondary",
  complete: "default",
  pending: "outline",
};

export function DeliveriesTable({ deliveries }: DeliveriesTableProps) {

  const { setDeliveryToDelete, openDeleteDialog } = useDeliveriesActionsStore();

  if (deliveries.length === 0) {
    return (
      <CustomNoResultsCard
        title="No hay ventas registradas"
        message="Cuando registres ventas, aparecerán aquí."
        icon={Truck}
      />
    );
  }

  const totalDelivered = deliveries.reduce((sum, d) => sum + d.tn_delivered, 0);

  const handleDeleteDelivery = (delivery: Delivery) => {
    setDeliveryToDelete(delivery);
    openDeleteDialog();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Carta de Porte</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Tn Entregadas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-medium">
                {delivery.waybill_number}
              </TableCell>
              <TableCell>{delivery.destination}</TableCell>
              <TableCell >
                {formatTn(delivery.tn_delivered)} tn
              </TableCell>

              <TableCell>
                <Badge variant={statusVariants[delivery.status]}>
                  {statusLabels[delivery.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatDate(delivery.delivery_date)}
              </TableCell>
              <TableCell className="py-4 px-4 text-right">
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
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50 font-medium">
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell >
              {formatTn(totalDelivered)} tn
            </TableCell>
            <TableCell colSpan={3}></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
