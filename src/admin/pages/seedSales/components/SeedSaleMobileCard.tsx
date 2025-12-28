import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Edit2, Trash2 } from "lucide-react"

interface SeedSaleMobileCardProps {
  item: any
  isExpanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  getStatusBadge: (status: string) => React.ReactNode
  formatKg: (value: number) => string
  currencyFormatter: (value: number) => string
  calculatePercentage: (kg_sold: number, kg_delivered: number) => string
}

export const SeedSaleMobileCard = ({
  item,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  getStatusBadge,
  formatKg,
  currencyFormatter,
  calculatePercentage,
}: SeedSaleMobileCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header row */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{item.waybill_number}</span>
                {getStatusBadge(item.status)}
              </div>
              <p className="text-muted-foreground text-sm">{item.destination}</p>
              <p className="text-muted-foreground text-xs">{new Date(item.sale_date).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center bg-muted/50 rounded-lg p-2">
            <div>
              <p className="text-xs text-muted-foreground">Entregados</p>
              <p className="font-semibold text-sm">{formatKg(item.kg_delivered)} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vendidos</p>
              <p className="font-semibold text-sm text-green-600">{formatKg(item.kg_sold)} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">% Venta</p>
              <p className="font-semibold text-sm">{calculatePercentage(item.kg_sold, item.kg_delivered)}%</p>
            </div>
          </div>

          {/* Expand toggle */}
          {item.deliveries && item.deliveries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-muted-foreground"
              onClick={onToggle}
            >
              <span>Ver ventas ({item.deliveries.length})</span>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Expanded deliveries */}
        {isExpanded && item.deliveries && item.deliveries.length > 0 && (
          <div className="border-t bg-muted/30 p-3 space-y-2">
            {item.deliveries.map((delivery: any) => (
              <div key={delivery.id} className="bg-background rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{delivery.destination}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(delivery.delivery_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">KG</p>
                    <p className="font-medium">{formatKg(delivery.kg_delivered)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Precio/KG</p>
                    <p className="font-medium">{currencyFormatter(delivery.price_per_kg)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold text-green-600">
                      {currencyFormatter(delivery.kg_delivered * delivery.price_per_kg)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Total row */}
            <div className="bg-primary/10 rounded-lg p-3 flex justify-between items-center">
              <span className="font-semibold text-sm">Total</span>
              <span className="font-bold">
                {currencyFormatter(
                  item.deliveries.reduce((sum: number, d: any) => sum + d.kg_delivered * d.price_per_kg, 0)
                )}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
