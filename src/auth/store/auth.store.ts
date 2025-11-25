import { User } from '@/auth/interfaces/user.interface'
import { create } from 'zustand'
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';
import { registerAction } from '../actions/register.action';
import { updateUserProfileAction } from '../actions/updateUserProfile.action';
import { changePasswordAction } from '../actions/changePassword.action';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

interface RegisterOptions {
  email: string;
  password: string;
  name: string;
  roles: string[];  // array de roles
  status: boolean;  // true = activo, false = inactivo
}


type AuthState = {
  // properties
  user: User | null;
  token: string | null;
  isAuthenticated: AuthStatus;
  // getters
  isAdmin: () => boolean;
  // actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  register: (options: RegisterOptions) => Promise<boolean>;
  updateUserProfile: (userId: string, name: string, email: string) => Promise<boolean>;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // implementacion del store
  user: null,
  token: null,
  isAuthenticated: 'checking',

  //getters
  isAdmin: () => {
    const roles = get().user?.roles || [];
    return roles.includes('admin');
  },

  //actions
  login: async (email: string, password: string) => {

    try {
      const data = await loginAction(email, password);
      localStorage.setItem("isAuthenticated", "true");

      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, isAuthenticated: 'authenticated' });
      return true;
    } catch (error) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: 'not-authenticated' });
      console.log(error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: 'not-authenticated' });
  },

  checkAuthStatus: async () => {
    try {
      const { user, token } = await checkAuthAction();
      set({
        user: user,
        token: token,
        isAuthenticated: 'authenticated'
      });
      return true;
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: 'not-authenticated'
      });
      return false;
    }
  },

  register: async ({ email, password, name, roles, status }: RegisterOptions) => {
    try {
      const data = await registerAction(email, password, name, roles, status);

      if (!data?.user) {
        console.warn("Usuario creado pero no se devolvió información del usuario");
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return false;
    }
  },

  updateUserProfile: async (userId: string, name: string, email: string) => {
    try {
      const message = await updateUserProfileAction(userId, name, email);

      if (!message) {
        console.warn("Usuario actualizado pero no se devolvió mensaje");
        return true;
      }

      set({
        user: {
          ...get().user!,
          name,
          email
        }
      });

      return true;

    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return false;
    }
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    try {
      const message = await changePasswordAction(userId, currentPassword, newPassword);

      if (!message) {
        console.warn("Contraseña cambiada pero no se devolvió mensaje");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      return false;
    }
  }

}))

