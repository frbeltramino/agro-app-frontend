import { useQuery } from "@tanstack/react-query";
import { getCropNamesAction } from "../actions/crops/get-crop-names.action";

export const useCropNames = () => {
  const query = useQuery({
    queryKey: ["crop-names"],
    queryFn: () => getCropNamesAction(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
  }


}
