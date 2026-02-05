import { agroApi } from "@/api/agroApi";

export const verifyOtpAction = async (email: string, otp: string) => {
  return agroApi.post(`/otp/verify-otp`, {
    email,
    otp,
  });
};