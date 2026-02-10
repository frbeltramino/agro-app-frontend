import { agroApi } from "@/api/agroApi";

interface CreateLotMasterData {
  name: string,
  default_surface: number,
}

export const createLotMasterAction = async (data: CreateLotMasterData) => {
  const { data: lot } = await agroApi.post(`/lot/master/new`, data);
  return lot;
};