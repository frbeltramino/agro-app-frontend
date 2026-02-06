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
      newPassword,
    });

    return data.message;
  } catch (error: any) {
    // Extraer mensaje del backend si existe
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    // Si no, lanzar error genérico
    throw new Error("Error al cambiar la contraseña");
  }
};