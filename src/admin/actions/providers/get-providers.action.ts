import { agroApi } from "@/api/agroApi"
import { ProvidersResponse } from "@/interfaces/providers/providers.response";

export const getProvidersAction = async (): Promise<ProvidersResponse> => {

  const { data } = await agroApi.get<ProvidersResponse>('/providers', {
  });

  return data;
}