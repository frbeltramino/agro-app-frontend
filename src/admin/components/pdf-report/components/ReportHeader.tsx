
import { CustomLogoSidebarLight } from "@/components/custom/LogoSidebarLight";
import { Campaign } from "@/interfaces/campaigns/campaign.interface";

interface Props {
  reportCampaign: Campaign | null;
}

export const ReportHeader = ({ reportCampaign }: Props) => {


  const today = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-report-header text-report-header-foreground rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">

        {/* Lado izquierdo */}
        <div className="flex items-center gap-6">



          {/* Texto */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Reporte de Campaña
            </h1>
            <p className="text-sm opacity-80 mt-1">
              {reportCampaign?.name} — Generado el {today}
            </p>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="text-right">
          {/* Logo principal */}
          <div className="h-24 w-auto  rounded-xl px-4 py-3 flex items-center justify-center">
            <CustomLogoSidebarLight />
          </div>
        </div>
      </div>
    </div>
  );
};