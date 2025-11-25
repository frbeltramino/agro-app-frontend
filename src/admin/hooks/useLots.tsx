import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getLotsByCampaignIdAction } from "../actions/lots/get-lots-by-campaign-id.action";
import { createUpdateLotAction } from "../actions/lots/create-update-lot.action";
import { deleteLotAction } from "../actions/lots/delete-lot-action";

interface UseLotsOptions {
  campaignId: number; // obligatorio
}

export const useLots = ({ campaignId }: UseLotsOptions) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // opcionales con default
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const q = searchParams.get("query") || "";

  const query = useQuery({
    queryKey: ["lots", { campaignId, page, limit, q }],
    queryFn: () =>
      getLotsByCampaignIdAction({
        campaignId,
        page,
        limit,
        search: q,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const mutation = useMutation({
    mutationFn: createUpdateLotAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteLot = useMutation({
    mutationFn: deleteLotAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lots"] });
    },
  });

  return {
    ...query,
    mutation,
    deleteLot
  }
};