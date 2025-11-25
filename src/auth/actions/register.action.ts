import { agroApi } from "@/api/agroApi";
import type { AuthResponse } from "../interfaces/auth.response";


export const registerAction = async (email: string, password: string, name: string, roles: string[], status: boolean): Promise<AuthResponse> => {

  try {

    const { data } = await agroApi.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
      roles,
      status
    });

    return data


  } catch (error) {
    throw error;
  }

}