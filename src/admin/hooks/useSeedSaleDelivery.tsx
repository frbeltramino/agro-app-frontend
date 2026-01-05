import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateSaleDeliveryAction } from "../actions/seedSalesDeliveries/create-update-delivery-sale";
import { deleteDeliverySaleAction } from "../actions/seedSalesDeliveries/delete-delivery-sale";
import { useAuthStore } from "@/auth/store/auth.store";


export const useSeedSaleDelivery = () => {

  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: createUpdateSaleDeliveryAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedSales", user?.id] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteSaleDelivery = useMutation({
    mutationFn: deleteDeliverySaleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedSales"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    mutation,
    deleteSaleDelivery
  };

};