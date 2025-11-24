import axios from "axios";

//
// DŮLEŽITÉ: API_URL závisí na tom, kde spouštíš appku.
//
// Android emulátor (Android Studio):
//   const API_URL = "http://10.0.2.2:8000";
//
// iOS simulator (macOS):
//   const API_URL = "http://localhost:8000";
//
// Reálný telefon v jedné Wi-Fi síti s backendem:
//   const API_URL = "http://IP_TVÉHO_PC:8000";
//   např. "http://192.168.0.15:8000"
//

const API_URL = "http://10.0.2.2:8000"; // uprav podle svého prostředí

export const api = axios.create({
  baseURL: API_URL,
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}
