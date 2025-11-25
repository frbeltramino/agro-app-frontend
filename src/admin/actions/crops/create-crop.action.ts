import { agroApi } from "@/api/agroApi";
import { Crop } from "@/interfaces/crops/crop.interface";

export const createCropAction = async (cropData: any): Promise<Crop> => {

  const { id, start_date, end_date, campaign_id, lot_id, seed_type, expected_yield, total_estimated, real_yield, status, crop_name_id } = cropData;

  console.log('cultivo:', { cropData });

  const isCreating = id === 'new';

  const { data } = await agroApi<Crop>({
    url: isCreating ? '/crops/new' : `/crops/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      crop_name_id,
      start_date,
      end_date,
      campaign_id,
      lot_id,
      seed_type,
      expected_yield,
      total_estimated,
      real_yield,
      status
    }
  })

  return data;

}