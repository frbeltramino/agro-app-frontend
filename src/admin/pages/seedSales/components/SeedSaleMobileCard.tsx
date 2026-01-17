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
  formatTn: (value: number) => string
  currencyFormatter: (value: number) => string
  calculatePercentage: (tn_sold: number, tn_delivered: number) => string
}

export const SeedSaleMobileCard = ({
  item,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  getStatusBadge,
  formatTn,
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
              <div className="space-y-0.5 mb-1">
                <p className="text-sm flex items-center gap-1">
                  🌱 <span className="font-medium">{item.crop_name}</span>
                </p>
                <p className="text-xs flex items-center gap-1 text-muted-foreground">
                  📅 {item.campaign_name}
                </p>
              </div>

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
              <p className="text-xs text-muted-foreground">Entregadas</p>
              <p className="font-semibold text-sm">{formatTn(item.tn_delivered)} tn</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vendidas</p>
              <p className="font-semibold text-sm text-green-600">{formatTn(item.tn_sold)} tn</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">% Venta</p>
              <p className="font-semibold text-sm">{calculatePercentage(item.tn_sold, item.tn_delivered)}%</p>
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
          <div className="border-t bg-muted/30 p-3 space-y-4">
            {item.deliveries.map((delivery: any) => (
              <div
                key={delivery.id}
                className="bg-background rounded-lg p-4 shadow-sm border border-muted/30"
              >
                {/* Fila superior */}
                <div className="grid grid-cols-3 gap-4 items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{delivery.destination}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(delivery.delivery_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Liquidación Primaria</p>
                    <p className="font-medium">{delivery.primary_liquidation_number}</p>
                  </div>

                  {/* Columna vacía para alinear con Total */}
                  <div />
                </div>

                {/* Fila inferior */}
                <div className="grid grid-cols-3 gap-4 text-sm border-t border-muted/20 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">tn</p>
                    <p className="font-medium">
                      {formatTn(delivery.tn_delivered)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Precio / tn</p>
                    <p className="font-medium">
                      {currencyFormatter(delivery.price_per_tn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold text-green-600">
                      {currencyFormatter(
                        delivery.tn_delivered * delivery.price_per_tn
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Total general */}
            <div className="bg-primary/10 rounded-lg p-4 flex justify-between items-center shadow-sm">
              <span className="font-semibold text-sm uppercase tracking-wide">
                Total
              </span>
              <span className="font-bold text-base">
                {currencyFormatter(
                  item.deliveries.reduce(
                    (sum: number, d: any) =>
                      sum + d.tn_delivered * d.price_per_tn,
                    0
                  )
                )}
              </span>
            </div>
          </div>

        )}
      </CardContent>
    </Card>
  )
}
