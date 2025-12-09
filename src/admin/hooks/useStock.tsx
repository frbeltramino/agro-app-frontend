import { adjustStockAction } from "../actions/stock/adjust-stock.action";
import { deleteStockAction } from "../actions/stock/delete-stock.action";
import { getStockAction } from "../actions/stock/get-stock.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrUpdateStockAction } from "../actions/stock/create-update-stock.action";
import { useSearchParams } from "react-router-dom";
import { createCropStockAction } from "../actions/stock/create-crop-stock.action";



export const useStock = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const q = searchParams.get("search") || "";
  const categoryId = searchParams.get("category_id") || "";

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["stock", { page, limit, q, categoryId }],
    queryFn: () =>
      getStockAction({
        page: isNaN(Number(+page)) ? 1 : Number(page),
        limit: isNaN(Number(+limit)) ? 10 : Number(limit),
        search: q,
        categoryId
      }),
    staleTime: 1000 * 60 * 5,
  });

  const adjustStock = useMutation({
    mutationFn: adjustStockAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["stockStats"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteStock = useMutation({
    mutationFn: deleteStockAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["stockStats"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await createOrUpdateStockAction(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["stockStats"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const createCropStock = useMutation({
    mutationFn: async (data: any) => {
      const response = await createCropStockAction(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["stockStats"] });
      queryClient.invalidateQueries({ queryKey: ["supply"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    adjustStock,
    deleteStock,
    mutation,
    createCropStock
  }
};