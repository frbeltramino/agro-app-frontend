import { agroApi } from "@/api/agroApi";
import { CropCreateResponse } from "@/interfaces/crops/crop.create.response";

export const createCropAction = async (cropData: any): Promise<CropCreateResponse> => {

  const { id, start_date, end_date, campaign_id, lot_id, seed_type, expected_yield, total_estimated, real_yield, status, crop_name_id } = cropData;


  const isCreating = id === 'new';

  const { data } = await agroApi<CropCreateResponse>({
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