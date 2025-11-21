import api from "./axiosInstance";

export async function loginApi(email: string, password: string) {
  const res = await api.post("/users/login", { email, password });
  return res.data;
}

export async function signupApi(email: string, password: string) {
  const res = await api.post("/users/signup", { email, password });
  return res.data;
}

export async function refreshTokenApi(refreshToken: string) {
  const res = await api.post("/users/refresh", { refreshToken });
  return res.data;
}

export async function logoutApi() {
  const res = await api.post("/users/logout");
  return res.data;
}
