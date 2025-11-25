import { agroApi } from "@/api/agroApi";
import { AuthResponse } from "../interfaces/auth.response";

export const loginAction = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data } = await agroApi.post<AuthResponse>("/auth/login", {
      email,
      password
    });

    return data;

  } catch (error) {
    throw error;
  }
}