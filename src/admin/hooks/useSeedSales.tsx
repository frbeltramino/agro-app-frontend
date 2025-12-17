import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSeedSalesAction } from "../actions/seedSales/get-seed-sales.action";
import { useSearchParams } from "react-router-dom";
import { createUpdateSaleAction } from "../actions/seedSales/ceate-update-sale.action";
import { deleteSeedSaleAction } from "../actions/seedSales/delete-seed-sale.action";

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

  const query = useQuery({
    queryKey: ["seedSales", { page, limit, waybill_number, destination, start_date, end_date }],
    queryFn: () =>
      getSeedSalesAction({
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
