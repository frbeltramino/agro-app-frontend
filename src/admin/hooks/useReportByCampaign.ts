import { useQuery } from "@tanstack/react-query";
import { getReportByCampaignAction } from "../actions/reports/get-report-by-campaign.action";

interface Props {
  campaignId: number | null;
}


export const useReportByCampaign = ({ campaignId }: Props) => {


  const query = useQuery({
    queryKey: ['reportByCampaign', campaignId],
    queryFn: () => {
      if (!campaignId) throw new Error("No se selecciono una campaña");
      return getReportByCampaignAction({ campaignId: campaignId });
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!campaignId, // solo corre si hay campaña seleccionada
  });

  return {
    ...query,
  };
};