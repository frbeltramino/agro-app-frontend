
import { MapPin } from "lucide-react";
import { ReportCampaignResponse } from "@/interfaces/report/report.campaign.response";
import { ReportEmptySection } from "./ReportEmptySection";
import { formatTn } from "@/lib/format-tn";
import { formatDate } from "@/lib/format-date";

interface Props {
  reportData: ReportCampaignResponse[] | undefined;
}


export const LotsSection = ({ reportData }: Props) => {
  if (!reportData || reportData.length === 0) {
    return (
      <ReportEmptySection
        title="Lotes"
        message="No se registraron lotes para esta campaña."
        icon={<MapPin className="w-4 h-4" />}
      />
    );
  }

  // Filtramos lotes que tengan cultivos
  const lotsWithCrops = reportData.filter((lot) => lot.crops && lot.crops.length > 0);

  if (lotsWithCrops.length === 0) {
    return (
      <ReportEmptySection
        title="Lotes"
        message="No se registraron cultivos para los lotes de esta campaña."
        icon={<MapPin className="w-4 h-4" />}
      />
    );
  }


  return (


    <section className="mb-6">
      <h2 className="report-section-title flex items-center gap-2">
        <MapPin className="w-4 h-4" /> Lotes
      </h2>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-report-table-header text-report-header-foreground">
              <th className="text-left px-4 py-2.5 font-semibold">Lote</th>
              <th className="text-right px-4 py-2.5 font-semibold">Hectáreas</th>
              <th className="text-left px-4 py-2.5 font-semibold">Cultivo</th>
              <th className="text-left px-4 py-2.5 font-semibold">Semilla</th>
              <th className="text-right px-4 py-2.5 font-semibold">Rinde (tn)</th>
              <th className="text-left px-4 py-2.5 font-semibold">Inicio</th>
              <th className="text-left px-4 py-2.5 font-semibold">Fin</th>
            </tr>
          </thead>
          <tbody>
            {lotsWithCrops.map((lot) =>
              lot.crops.map((crop) => (
                <tr key={`${lot.lot_id}-${crop.crop_id}`} className="even:bg-report-table-stripe">
                  <td className="px-4 py-2.5 font-medium">{lot.lot_name}</td>
                  <td className="px-4 py-2.5 text-right">{formatTn(lot.hectares)}</td>
                  <td className="px-4 py-2.5">{crop.crop_name}</td>
                  <td className="px-4 py-2.5">{crop.seed_type ?? "-"}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-primary">{formatTn(crop.real_yield)}</td>
                  <td className="px-4 py-2.5">{formatDate(crop.start_date)}</td>
                  <td className="px-4 py-2.5">{crop.end_date ? formatDate(crop.end_date) : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
};

