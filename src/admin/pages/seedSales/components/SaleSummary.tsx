import { useState } from "react";
import { Calendar, Leaf, ChevronDown } from "lucide-react";
import { formatTn } from "@/lib/format-tn";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";


interface SaleSummaryProps {
  showContext?: boolean;
  selectedCampaign: string | null;
  contextOpenValue?: boolean;
  cropName?: string | null;
  cropTotalHervested?: number;
  cropTotalDelivered?: number;
  cropTotalSold?: number;
  loading?: boolean;
}

export const SaleSummary = ({
  showContext = true,
  selectedCampaign,
  contextOpenValue,
  cropName,
  cropTotalHervested,
  cropTotalDelivered,
  cropTotalSold,
  loading
}: SaleSummaryProps) => {
  const [contextOpen, setContextOpen] = useState(contextOpenValue || false);


  return (
    <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
      {loading && <CustomLoadingCard />}

      {/* Campaña + Cultivo */}
      {!loading && showContext && (
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

              {cropName && (
                <>
                  <p className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Cultivo: <strong>{cropName}</strong>
                  </p>

                  <div className="pl-6 space-y-0.5">
                    {
                      cropTotalHervested != null && (
                        <p className="text-xs text-muted-foreground">
                          Tn cosechadas:{" "}
                          <span className="font-medium">
                            {formatTn(cropTotalHervested)} tn
                          </span>
                        </p>
                      )
                    }
                    {
                      cropTotalDelivered != null && (
                        <p className="text-xs text-muted-foreground">
                          Tn entregadas:{" "}
                          <span className="font-medium">
                            {formatTn(cropTotalDelivered)} tn
                          </span>
                        </p>
                      )
                    }

                    {
                      cropTotalSold != null && (
                        <p className="text-xs text-muted-foreground">
                          Tn Vendidas:{" "}
                          <span className="font-medium">
                            {formatTn(cropTotalSold)} tn
                          </span>
                        </p>
                      )
                    }
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
