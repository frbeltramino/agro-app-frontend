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
  totalKgSold: number
  isAddingDelivery: boolean
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export function SeedSaleDeliveriesTable({
  deliveries,
  totalKgSold,
  isAddingDelivery,
  onEdit,
  onDelete,
}: Props) {
  const formatKg = (value: number) => value.toLocaleString("es-AR")
  const currencyFormatter = (value: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value)

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Mobile view */}
      <div className="md:hidden divide-y">
        {deliveries.map((d, index) => (
          <div key={index} className="p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{d.destination}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(d.delivery_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
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
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">KG</p>
                <p className="font-medium">{formatKg(d.kg_delivered)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">$/KG</p>
                <p className="font-medium">{currencyFormatter(d.price_per_kg)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-green-600">
                  {currencyFormatter(d.kg_delivered * d.price_per_kg)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Total row mobile */}
        <div className="p-3 bg-muted/50 flex justify-between items-center font-semibold text-sm">
          <span>Total: {formatKg(totalKgSold)} kg</span>
          <span>
            {currencyFormatter(deliveries.reduce((sum, d) => sum + d.kg_delivered * d.price_per_kg, 0))}
          </span>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead className="text-right">KG</TableHead>
              <TableHead className="text-right">Precio/KG</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((d, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(d.delivery_date).toLocaleDateString()}</TableCell>
                <TableCell>{d.destination}</TableCell>
                <TableCell className="text-right">{formatKg(d.kg_delivered)}</TableCell>
                <TableCell className="text-right">{currencyFormatter(d.price_per_kg)}</TableCell>
                <TableCell className="text-right font-medium">
                  {currencyFormatter(d.kg_delivered * d.price_per_kg)}
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
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">{formatKg(totalKgSold)}</TableCell>
              <TableCell />
              <TableCell className="text-right">
                {currencyFormatter(deliveries.reduce((sum, d) => sum + d.kg_delivered * d.price_per_kg, 0))}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
