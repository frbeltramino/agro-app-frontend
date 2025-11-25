import { useSearchParams } from "react-router-dom";
import { getCropsByLotIdAction } from "../actions/crops/get-crops-by-lot-id.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCropAction } from "../actions/crops/create-crop.action";
import { deleteCropAction } from "../actions/crops/delete-crop.action";

interface UseLotsOptions {
  lotId: number; // obligatorio
}

export const useCrops = ({ lotId }: UseLotsOptions) => {
  const [searchParams] = useSearchParams();

  const QueryClient = useQueryClient();

  // opcionales con default
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const q = searchParams.get("query") || "";

  const query = useQuery({
    queryKey: ["crops", { lotId, page, limit, q }],
    queryFn: () =>
      getCropsByLotIdAction({
        lotId,
        page,
        limit,
        search: q,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const createCrop = useMutation({
    mutationFn: createCropAction,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["crops"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteCrop = useMutation({
    mutationFn: deleteCropAction,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["crops"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    createCrop,
    deleteCrop
  }
};