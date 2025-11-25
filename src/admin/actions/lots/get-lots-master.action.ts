import { agroApi } from "@/api/agroApi";
import { LotsMasterResponse } from "@/interfaces/lots/lots.master.response";


export const getLotsMasterAction = async (): Promise<LotsMasterResponse> => {
  const { data } = await agroApi.get<any>('/lot/master', {
  });

  return data;
}
