import { agroApi } from "@/api/agroApi";
import { ReportCampaignResponse } from "@/interfaces/report/report.campaign.response";

interface Props {
  campaignId: number;
}

export const getReportByCampaignAction = async ({ campaignId }: Props): Promise<ReportCampaignResponse[]> => {
  const response = await agroApi.get(`/pdf/report/campaign/?campaign_id=${campaignId}`);
  return response.data;
};