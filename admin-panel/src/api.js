import axios from "axios";

const API_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
});

export function setToken(token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
