import { agroApi } from "@/api/agroApi";

interface Options {
  campaignId: number;
  page?: number;
  limit?: number;
}

export const getVariableExpenses = async ({ campaignId, page = 1, limit = 10 }: Options) => {
  const { data } = await agroApi.get("/variable/expenses", {
    params: {
      campaignId,
      page,
      limit
    },
  });

  return data;
};