
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportHeader } from "../components/ReportHeader";
import { SummaryCards } from "../components/SummaryCards";
import { LotsSection } from "../components/LotsSection";
import { ExpensesSection } from "../components/ExpensesSection";
import { DeliveriesSalesSection } from "../components/DeliveriesSalesSection";
import { LaborsSection } from "../components/LaborsSection";

// import "../report.css";

import { useReportByCampaign } from "@/admin/hooks/useReportByCampaign";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import { CustomErrorSection } from "@/components/custom/CustomErrorSection";
import { Campaign } from "@/interfaces/campaigns/campaign.interface";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { CustomLogoMobile } from "@/components/custom/CustomlogoMobile";
import { ReportEmptySection } from "../components/ReportEmptySection";
import { formatTn } from "@/lib/format-tn";


interface Props {
  reportCampaign: Campaign | null;
}

export const CampaignReportPage = ({ reportCampaign }: Props) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: reportData, isLoading, isError } = useReportByCampaign({ campaignId: reportCampaign ? reportCampaign.id : null });

  const handleExportPDF = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Reporte-${reportCampaign?.name}`,
  });

  if (isLoading) return <CustomLoadingCard />;
  if (isError) return <CustomErrorSection message="Error al generar el reporte" />;


  if (!reportData) {
    return (
      <ReportEmptySection
        title="Reporte de Campaña"
        message="No se pudo obtener información de esta campaña."
        icon={<FileDown className="w-4 h-4" />}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Botón de exportar PDF */}
        <div className="flex justify-end mb-4 no-print">
          <Button onClick={handleExportPDF} className="gap-2">
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>

        <div ref={reportRef} className="bg-card rounded-xl shadow-lg border border-border p-6 sm:p-8">
          <ReportHeader reportCampaign={reportCampaign} />

          {/* Resumen general */}
          <SummaryCards reportData={reportData} />

          <LotsSection reportData={reportData} />

          {/* Secciones por lote y cultivo */}
          {reportData.map((lot) => (
            <section key={lot.lot_id} className="mb-6">
              <h2 className="text-lg font-bold mb-2">{lot.lot_name} — {formatTn(lot.hectares)} ha</h2>

              {lot.crops.map((crop) => (
                <div key={crop.crop_id} className="mb-4 pl-4 border-l-2 border-muted-foreground">
                  <h3 className="font-semibold mb-1">{crop.crop_name} — {formatTn(crop.real_yield)} tn</h3>

                  <LaborsSection crops={[crop]} />
                  <ExpensesSection crops={[crop]} />
                  <DeliveriesSalesSection crops={[crop]} />
                </div>
              ))}
            </section>
          ))}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-3 text-xs text-muted-foreground">
            <p className="text-center">
              {`Este reporte fue generado automáticamente · ${reportCampaign?.name} · AgroHuracán`}
            </p>

            <div className="h-6 w-auto">
              <CustomLogoMobile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




