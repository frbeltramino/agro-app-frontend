import { agroApi } from "@/api/agroApi";
import { MessageResponse } from "@/auth/interfaces/message.Interface";

export const updateUserProfileAction = async (
  userId: string,
  name: string,
  email: string
): Promise<string> => {
  try {
    const { data } = await agroApi.patch<MessageResponse>("/auth/updateUserProfile", {
      userId,
      name,
      email,
    });

    return data.message;
  } catch (error: any) {
    // Unificamos todo en un solo mensaje
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al actualizar usuario";

    // Lanzamos un solo error con ese mensaje
    throw new Error(message);
  }
};