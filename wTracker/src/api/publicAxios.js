import axios from "axios"
import { applyCsrfHeader } from "../utils/csrf"

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

publicApi.interceptors.request.use(applyCsrfHeader, (error) => Promise.reject(error))

export default publicApi
