import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginApi(email: string, password: string) {
  const res = await axios.post(
    `${API_BASE_URL}/users/login`,
    { email, password },
    { withCredentials: true }
  );
  return res.data;
}

export async function signupApi(email: string, password: string) {
  const res = await axios.post(
    `${API_BASE_URL}/users/signup`,
    { email, password },
    { withCredentials: true }
  );
  return res.data;
}

export async function refreshTokenApi(refreshToken: string) {
  return axios.post(
    `${API_BASE_URL}/users/refresh`,
    { refreshToken },
    { withCredentials: true }
  );
}

export async function logoutApi() {
  const res = await axios.post(
    `${API_BASE_URL}/users/logout`,
    {},
    { withCredentials: true }
  );
  return res.data;
}
