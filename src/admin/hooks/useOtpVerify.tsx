import { useMutation } from "@tanstack/react-query";
import { verifyOtpAction } from "../actions/otp/verify-otp.action";
import { toast } from "sonner";

export const useOtpVerify = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtpAction(email, otp),
    onSuccess: () => toast.success("Código verificado"),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al verificar OTP");
    },
  });
};