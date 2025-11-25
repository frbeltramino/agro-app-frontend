import { agroApi } from "@/api/agroApi";
import { Lot } from "@/interfaces/lots/lot.interface";

export const createUpdateLotAction = async (lotData: any): Promise<Lot> => {
  const { id, name, hectares, location, campaign_id } = lotData;

  const isCreating = id === 0;;

  const { data } = await agroApi<Lot>({
    url: isCreating ? '/lots/new' : `/lots/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      name,
      hectares,
      location,
      campaign_id,
    }
  })


  return data;
};