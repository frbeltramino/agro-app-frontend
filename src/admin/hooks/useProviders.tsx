
import { getProvidersAction } from "../actions/providers/get-providers.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProviderAction } from "../actions/providers/create-provider.action";


export const useProviders = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProvidersAction(),
    staleTime: 1000 * 60 * 5,
  });

  const createProviderMutation = useMutation({
    mutationFn: (name: string) => createProviderAction(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    data,
    isLoading,
    isError,
    createProviderMutation,
  };


}