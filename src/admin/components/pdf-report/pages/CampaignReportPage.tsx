import { FileDown, } from "lucide-react";
import { Button } from "@/components/ui/button";


import { useReportByCampaign } from "@/admin/hooks/useReportByCampaign";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import { CustomErrorSection } from "@/components/custom/CustomErrorSection";
import { Campaign } from "@/interfaces/campaigns/campaign.interface";


import { ReportEmptySection } from "../components/ReportEmptySection";

import { buildReportTemplate } from "../templates/report_template_new.ts";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";




interface Props {
  reportCampaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CampaignReportPage = ({ reportCampaign,
  open,
  onOpenChange }: Props) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const { data: reportData, isLoading, isError } =
    useReportByCampaign({
      campaignId: reportCampaign ? reportCampaign.id : null,
    });

  const handleExportPDF = () => {
    if (!reportData?.length) return;

    const html = buildReportTemplate(
      reportData,
      reportCampaign?.name
    );

    setIsPrinting(true);

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("El navegador bloqueó la ventana emergente.");
      setIsPrinting(false);
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Detectar cuando se cierre la ventana
    const interval = setInterval(() => {
      if (printWindow.closed) {
        clearInterval(interval);
        setIsPrinting(false);
      }
    }, 500);
  };

  return (



    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[1100px] sm:max-w-[95vw] sm:max-h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white text-black border border-border/60">

          <div className="flex items-center justify-between px-6 py-6 border-b border-border shrink-0 h-16">
            <div className="flex items-center gap-2">
              <Dialog.Title className="text-lg sm:text-xl font-semibold">
                Reporte de Campaña

              </Dialog.Title>

            </div>


            <div className="flex items-center gap-2">

              <Button
                onClick={handleExportPDF}
                className="gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white"
              >
                <FileDown className="w-4 h-4" />
                <span >Exportar PDF</span>
              </Button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isLoading && <CustomLoadingCard />}

            {isError && (
              <CustomErrorSection message="Error al generar el reporte" />
            )}

            {!isLoading && !isError && !reportData && (
              <ReportEmptySection
                title="Reporte de Campaña"
                message="No se pudo obtener información de esta campaña."
                icon={<FileDown className="w-4 h-4" />}
              />
            )}

            {!isLoading && !isError && reportData && reportData?.length > 0 && (
              <div id="print-area">
                <div dangerouslySetInnerHTML={{
                  __html: buildReportTemplate(
                    reportData,
                    reportCampaign?.name
                  ),
                }} />
              </div>
            )}
          </div>

          {isPrinting && (
            <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center text-white text-lg rounded-2xl">
              Para continuar, cierre la ventana de impresión.
            </div>
          )}


        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >

  );
};