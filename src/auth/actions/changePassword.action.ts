import { agroApi } from "@/api/agroApi";
import { MessageResponse } from "@/auth/interfaces/message.Interface";

export const changePasswordAction = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<string> => {
  try {
    const { data } = await agroApi.patch<MessageResponse>("/auth/changePassword", {
      userId,
      currentPassword,
      newPassword
    });

    return data.message;

  } catch (error) {
    throw error;
  }
};