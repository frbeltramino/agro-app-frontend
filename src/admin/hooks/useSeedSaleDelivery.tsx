import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDeliverySaleAction } from "../actions/seedSalesDeliveries/delete-delivery-sale";
import { useAuthStore } from "@/auth/store/auth.store";
import { createUpdateSaleDeliveryAction } from "../actions/seedSalesDeliveries/create-update-delivery-sale";


export const useSeedSaleDelivery = () => {

  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: createUpdateSaleDeliveryAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedSales", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["crop-sale-availability"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteSaleDelivery = useMutation({
    mutationFn: deleteDeliverySaleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedSales"] });
      queryClient.invalidateQueries({ queryKey: ["crop-sale-availability"] });
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