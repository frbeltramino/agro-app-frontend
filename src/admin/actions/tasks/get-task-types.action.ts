import { agroApi } from "@/api/agroApi";
import { TaskTypesResponse } from "@/interfaces/cropTasks/taskTypes.response";


export const getTaskTypesAction = async (): Promise<TaskTypesResponse> => {

  const { data } = await agroApi.get<TaskTypesResponse>(`task/types`, {

  });

  return data;
}