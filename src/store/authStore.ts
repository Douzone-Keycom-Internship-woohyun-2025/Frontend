import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userEmail: string;
  login: (accessToken: string, userEmail: string) => void;
  logout: () => void;
}

function isTokenValid(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: isTokenValid(),
  userEmail: localStorage.getItem("userEmail") ?? "",

  login: (accessToken: string, email: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userEmail", email);
    set({ isLoggedIn: true, userEmail: email });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    set({ isLoggedIn: false, userEmail: "" });
  },
}));
