import { agroApi } from "@/api/agroApi"
import { CropTaskResponse } from "@/interfaces/cropTasks/cropTask.response";



interface Options {
  cropId: number;
  page?: number | string;
  limit?: number | string;
  description?: string;
  type?: string | number;
}

export const getTasksByCropIdAction = async (options: Options): Promise<CropTaskResponse> => {
  const { cropId, page, limit, description, type } = options;

  if (!cropId) throw new Error('Crop id is required');

  const { data } = await agroApi.get<CropTaskResponse>(`/tasks/crop/${cropId}`, {
    params: {
      page,
      limit,
      description,
      type
    }
  });

  return data;
}