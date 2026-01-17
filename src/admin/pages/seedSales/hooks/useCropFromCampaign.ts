import { useMemo } from "react";
import { useCropsToSale } from "@/admin/hooks/useCropsToSale";
import { CropSale } from "@/interfaces/crops/crop.sales.response";

export const useCropFromCampaign = (
  campaignId: number | null,
  cropNameId: number | null
) => {
  const { data, isLoading, error } = useCropsToSale({
    campaignId: campaignId ?? 0,
    enabled: !!campaignId,
  });

  const crop: CropSale | null = useMemo(() => {
    if (!data || !cropNameId) return null;
    return data.crops?.find(
      c => c.crop_name_id === cropNameId
    ) ?? null;
  }, [data, cropNameId]);

  return { crop, crops: data?.crops ?? [], isLoading, error };
};
