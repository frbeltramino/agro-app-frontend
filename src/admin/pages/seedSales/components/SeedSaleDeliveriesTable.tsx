import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"

interface Props {
  deliveries: any[]
  isAddingDelivery: boolean
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export function SeedSaleDeliveriesTable({
  deliveries,
  isAddingDelivery,
  onEdit,
  onDelete,
}: Props) {
  const formatTn = (value: number) => value.toLocaleString("es-AR")
  const currencyFormatter = (value: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value)

  const totalTnSoldDisplay = () => {
    if (deliveries.length > 0) {
      return formatTn(deliveries.reduce((sum, d) => sum + d.tn_delivered, 0))
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {deliveries.map((d, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-md border border-muted/30"
          >
            {/* Fila superior: destino, fecha, Liquidación primaria y acciones */}
            <div className="grid grid-cols-3 gap-4 items-start mb-2">
              <div>
                <p className="font-medium text-sm">{d.destination}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(d.delivery_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Liquidación Primaria</p>
                <p className="font-medium">{d.primary_liquidation_number}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onEdit(index)}
                  disabled={isAddingDelivery}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => onDelete(index)}
                  disabled={isAddingDelivery}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Fila de datos: tn, $/tn y total */}
            <div className="grid grid-cols-3 text-sm border-t border-muted/20 pt-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">tn</p>
                <p className="font-medium">{formatTn(d.tn_delivered)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">$/tn</p>
                <p className="font-medium">{currencyFormatter(d.price_per_tn)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-green-600">
                  {currencyFormatter(d.tn_delivered * d.price_per_tn)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Total row mobile */}
        <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center font-semibold text-sm">
          <span>Total: {totalTnSoldDisplay()} tn</span>
          <span>
            {currencyFormatter(
              deliveries.reduce((sum, d) => sum + d.tn_delivered * d.price_per_tn, 0)
            )}
          </span>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full ">
          <TableHeader>
            <TableRow>
              <TableHead>Liquidación Primaria</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead className="text-right">tn</TableHead>
              <TableHead className="text-right">Precio/tn</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((d, index) => (
              <TableRow key={index}>
                <TableCell>{d.primary_liquidation_number}</TableCell>
                <TableCell>{new Date(d.delivery_date).toLocaleDateString()}</TableCell>
                <TableCell>{d.destination}</TableCell>
                <TableCell className="text-right">{formatTn(d.tn_delivered)}</TableCell>
                <TableCell className="text-right">{currencyFormatter(d.price_per_tn)}</TableCell>
                <TableCell className="text-right font-medium">
                  {currencyFormatter(d.tn_delivered * d.price_per_tn)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(index)}
                      disabled={isAddingDelivery}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(index)}
                      disabled={isAddingDelivery}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{totalTnSoldDisplay()}</TableCell>
              <TableCell />
              <TableCell className="text-right">
                {currencyFormatter(deliveries.reduce((sum, d) => sum + d.tn_delivered * d.price_per_tn, 0))}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
