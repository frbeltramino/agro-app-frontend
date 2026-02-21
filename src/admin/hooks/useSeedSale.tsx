
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSeedMovementsAction } from "../actions/seedSales/get-seed-movements.action";
import { useSearchParams } from "react-router-dom";
import { deleteSeedSaleAction } from "../actions/seedSales/delete-seed-sale.action";
import { useAuthStore } from "@/auth/store/auth.store";
import { createUpdateSaleAction } from "../actions/seedSales/ceate-update-sale.action";

interface Options {
  page?: number | string;
  limit?: number | string;
  waybill_number?: string,
  destination?: string,
  start_date?: string,
  end_date?: string,
}

export const useSeedSales = ({
  waybill_number = "",
  destination = "",
  start_date = "",
  end_date = "",
}: Options) => {

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);


  const query = useQuery({
    queryKey: ["seedSales", user?.id, { page, limit, waybill_number, destination, start_date, end_date }],
    queryFn: () =>
      getSeedMovementsAction({
        page,
        limit,
        waybill_number,
        destination,
        start_date,
        end_date,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: createUpdateSaleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedSales"] });
      queryClient.invalidateQueries({ queryKey: ["crops-to-sale"] });
      queryClient.invalidateQueries({ queryKey: ["crop-sale-availability"] });
      queryClient.invalidateQueries({ queryKey: ["lotsStats"] });
      queryClient.invalidateQueries({ queryKey: ["reportByCampaign"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteSale = useMutation({
    mutationFn: deleteSeedSaleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedSales"] });
      queryClient.invalidateQueries({ queryKey: ["crops-to-sale"] });
      queryClient.invalidateQueries({ queryKey: ["crop-sale-availability"] });
      queryClient.invalidateQueries({ queryKey: ["lotsStats"] });
      queryClient.invalidateQueries({ queryKey: ["reportByCampaign"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    mutation,
    deleteSale
  };
};
