import { useQuery } from "@tanstack/react-query";
import { getLotsForVariableExpenses } from "../actions/variableExpenses/get-lots-for-variable-expenses.action";

interface UseLotsOptions {
  campaignId: number; // obligatorio
}


export const useLotsForVariableExpenses = ({ campaignId }: UseLotsOptions) => {

  const query = useQuery({
    queryKey: ["lots-for-variable-expenses", { campaignId }],
    queryFn: () =>
      getLotsForVariableExpenses(campaignId,),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: campaignId > 0,
  });

  return {
    ...query
  }
}