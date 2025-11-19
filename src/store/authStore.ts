import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  login: (accessToken: string, userEmail: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem("accessToken"),

  login: (accessToken: string, email: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userEmail", email);
    set({ isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    set({ isLoggedIn: false });
  },
}));
