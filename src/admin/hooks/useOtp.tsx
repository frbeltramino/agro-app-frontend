import { useMutation } from "@tanstack/react-query";
import { createAndSendOtpAction } from "../actions/otp/create-send-otp.action";

export const useOtp = () => {
  const createAndSendOtp = useMutation({
    mutationFn: createAndSendOtpAction,
    onSuccess: () => {
      console.log("Código enviado");
    },
    onError: (error: any) => {
      console.log(error)
    }
  });


  return {
    createAndSendOtp,
  }
}