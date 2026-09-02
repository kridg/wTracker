import axios from "axios"
import { applyCsrfHeader } from "../utils/csrf"
import publicApi from "./publicAxios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(applyCsrfHeader, (error) => Promise.reject(error))

let refreshPromise = null

const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = publicApi.post("/auth/refresh/").finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const url = originalRequest?.url || ""

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !url.includes("/auth/login/") &&
      !url.includes("/auth/refresh/") &&
      !url.includes("/auth/register/")
    ) {
      originalRequest._retry = true
      try {
        await refreshSession()
        return api(originalRequest)
      } catch (refreshError) {
        window.dispatchEvent(new Event("force-logout"))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
