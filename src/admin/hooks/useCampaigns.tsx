import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCampaignsAction } from "../actions/campaigns/get-campaigns.action";
import { useSearchParams } from "react-router-dom";
import { createUpdateCampaignAction } from "../actions/campaigns/create-update-campaign.action";
import { deleteCampaignAction } from "../actions/campaigns/delete-campaign.action";

export const useCampaigns = () => {
  // TODO: viene logica
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const q = searchParams.get("query") || "";

  const query = useQuery({
    queryKey: ['campaigns', { page, limit, q }],
    queryFn: () => getCampaignsAction({
      page: isNaN(Number(+page)) ? 1 : Number(page),
      limit: isNaN(Number(+limit)) ? 10 : Number(limit),
      search: q
    }),
    staleTime: 1000 * 60 * 5// 5 minutos
  });

  // TODO: mutacion
  const mutation = useMutation({
    mutationFn: createUpdateCampaignAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });

    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaignAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });


  return {
    ...query,
    mutation,
    deleteMutation

  }
}
