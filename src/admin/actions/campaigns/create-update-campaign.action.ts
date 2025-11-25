import { agroApi } from "@/api/agroApi";
import { Campaign } from "@/interfaces/campaigns/campaign.interface"

export const createUpdateCampaignAction = async (campaignData: any): Promise<Campaign> => {

  const { id, name, start_date, end_date, category_id, notes } = campaignData;

  console.log('Campaña:', campaignData);

  const isCreating = id === 'new';

  const { data } = await agroApi<Campaign>({
    url: isCreating ? '/campaigns/new' : `/campaigns/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      name,
      start_date,
      end_date,
      category_id,
      notes
    }
  })

  return data;

}