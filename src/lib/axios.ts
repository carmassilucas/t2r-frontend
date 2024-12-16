import { env } from "@/env";
import axios from "axios";
import Cookies from "js-cookie";

export const locationApi = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
});

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

const authRoute = "/interlocutor/auth";

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth");

    if (token && config.url && !config.url.includes(authRoute)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

