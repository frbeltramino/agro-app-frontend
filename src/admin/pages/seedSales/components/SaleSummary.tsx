import { useState } from "react";
import { Calendar, Leaf, FileText, MapPin, Settings, Truck, ChevronDown } from "lucide-react";
import { formatNumber } from "@/lib/format-number";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completado",
  cancelled: "Cancelado",
};

interface SaleSummaryProps {
  showContext?: boolean;
  showDelivery?: boolean;
  formValues: {
    waybill_number?: string;
    destination?: string;
    date?: string;
    status?: string;
    tn_delivered?: number;
  };
  selectedCampaign: string | null;
  selectedCrop: any;
  cropsData?: any[];
  contextOpenValue?: boolean;
  deliveryOpenValue?: boolean;
}

export const SaleSummary = ({
  showContext = true,
  showDelivery = false,
  formValues,
  selectedCampaign,
  selectedCrop,
  cropsData = [],
  contextOpenValue,
  deliveryOpenValue,
}: SaleSummaryProps) => {
  const [contextOpen, setContextOpen] = useState(contextOpenValue || false);
  const [deliveryOpen, setDeliveryOpen] = useState(deliveryOpenValue || false);


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
              {selectedCampaign && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Campaña: <strong>{selectedCampaign}</strong>
                </p>
              )}

              {selectedCrop && cropsData.length > 0 && (
                <>
                  <p className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Cultivo: <strong>{selectedCrop.crop_name}</strong>
                  </p>

                  <div className="pl-6 space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      Total cosechado:{" "}
                      <span className="font-medium">
                        {formatNumber(selectedCrop.total_harvested_tn.toString())} tn
                      </span>
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Ya entregado:{" "}
                      <span className="font-medium">
                        {formatNumber(selectedCrop.total_delivered_tn.toString())} tn
                      </span>
                    </p>
                  </div>
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
              {formValues.waybill_number && (
                <p className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Carta de porte: <strong>{formValues.waybill_number}</strong>
                </p>
              )}

              {formValues.destination && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destino: <strong>{formValues.destination}</strong>
                </p>
              )}

              {formValues.date && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha: {new Date(formValues.date).toLocaleDateString()}
                </p>
              )}

              {formValues.status && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Estado: <strong>{statusLabels[formValues.status] || formValues.status}</strong>
                </p>
              )}

              {formValues.tn_delivered !== undefined && (
                <p className="text-sm font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  tn a entregar: <strong>{formValues.tn_delivered}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
