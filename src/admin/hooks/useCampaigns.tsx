import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCampaignsAction } from "../actions/campaigns/get-campaigns.action";
import { useSearchParams } from "react-router-dom";
import { createUpdateCampaignAction } from "../actions/campaigns/create-update-campaign.action";
import { deleteCampaignAction } from "../actions/campaigns/delete-campaign.action";
import { useAuthStore } from "@/auth/store/auth.store";


export const useCampaigns = () => {
  // TODO: viene logica
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const q = searchParams.get("query") || "";

  const query = useQuery({
    queryKey: ['campaigns', user?.id, { page, limit, q }],
    queryFn: () => getCampaignsAction({
      page: isNaN(Number(+page)) ? 1 : Number(page),
      limit: isNaN(Number(+limit)) ? 10 : Number(limit),
      search: q
    }),
    staleTime: 1000 * 60 * 5// 5 minutos
  });

  const mutation = useMutation({
    mutationFn: createUpdateCampaignAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ["reportByCampaign"] });

    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaignAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ["reportByCampaign"] });
    }

  });


  return {
    ...query,
    mutation,
    deleteMutation

  }
}
