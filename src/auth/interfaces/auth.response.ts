import { User } from "@/auth/interfaces/user.interface";


export interface AuthResponse {
  user: User;
  token: string;
  message: string;


}

