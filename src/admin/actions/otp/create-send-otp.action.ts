import { agroApi } from "@/api/agroApi";

interface props {
  email: string;
}

export const createAndSendOtpAction = async (data: props) => {
  return agroApi.post(`/email/send-otp`, data);
};