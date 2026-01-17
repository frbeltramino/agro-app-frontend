import { Badge } from '@/components/ui/badge';
import { SeedSale } from '@/interfaces/sales/seed.sale.interface';
import { formatNumber } from '@/lib/format-number';
import { Calendar, ChevronDown, Coins, FileText, Leaf, MapPin, Settings, Truck } from 'lucide-react';
import { useState } from 'react'

interface SaleEditSummaryProps {
  showContext?: boolean;
  showDelivery?: boolean;
  seedSale: SeedSale | null
  contextOpenValue?: boolean;
  deliveryOpenValue?: boolean;
}

export const SaleEditSummary = ({ showContext = true, showDelivery = true, contextOpenValue, deliveryOpenValue, seedSale }: SaleEditSummaryProps) => {

  const [contextOpen, setContextOpen] = useState(contextOpenValue || false);
  const [deliveryOpen, setDeliveryOpen] = useState(deliveryOpenValue || false);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "Pendiente" },
      completed: { variant: "default", label: "Completado" },
      cancelled: { variant: "destructive", label: "Cancelado" },
      partial: { variant: "default", label: "Parcial" },
    }
    const badge = badges[status] || badges.pending
    return <Badge variant={badge.variant}>{badge.label}</Badge>
  }

  if (!seedSale) {
    return <div>No hay información disponible</div>
  }

  return (
    <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
      {/* Campaña + Cultivo */}
      {showContext && (
        <div className="space-y-1">
          <button
            type="button"
            className="flex items-center justify-between w-full text-sm text-muted-foreground"
            onClick={() => setContextOpen(!contextOpen)}
          >
            <span>Campaña y Cultivo</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${contextOpen ? "rotate-180" : ""}`}
            />
          </button>

          {contextOpen && (
            <div className="space-y-1 pt-2">
              {seedSale.campaign_name && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Campaña: <strong>{seedSale.campaign_name}</strong>
                </p>
              )}

              {seedSale.crop_name && (
                <>
                  <p className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Cultivo: <strong>{seedSale.crop_name}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Total entregado:<strong> {formatNumber(seedSale.tn_delivered.toString())} tn</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Ya vendido:<strong> {formatNumber(seedSale.tn_sold.toString())} tn</strong>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      {showDelivery && <div className="h-px bg-muted" />}

      {/* Datos de la entrega */}
      {showDelivery && (
        <div className="space-y-1">
          <button
            type="button"
            className="flex items-center justify-between w-full text-sm text-muted-foreground"
            onClick={() => setDeliveryOpen(!deliveryOpen)}
          >
            <span>Datos de la entrega</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${deliveryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {deliveryOpen && (
            <div className="space-y-1 pt-2">
              {seedSale.waybill_number && (
                <p className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Carta de porte: <strong>{seedSale.waybill_number}</strong>
                </p>
              )}

              {seedSale.destination && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destino: <strong>{seedSale.destination}</strong>
                </p>
              )}

              {seedSale.sale_date && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha: {new Date(seedSale.sale_date).toLocaleDateString()}
                </p>
              )}

              {seedSale.status && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Estado: {getStatusBadge(seedSale.status)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
