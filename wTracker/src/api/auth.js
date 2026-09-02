import api from "./axios"
import publicApi from "./publicAxios"
import { setCsrfToken } from "../utils/csrf"

export const fetchCsrfToken = async () => {
  const res = await publicApi.get("/auth/csrf/")
  setCsrfToken(res.data.csrfToken)
  return res.data.csrfToken
}

export const loginUser = async (data) => {
  const res = await publicApi.post("/auth/login/", data)
  return res.data
}

export const registerUser = async (data) => {
  const res = await publicApi.post("/auth/register/", data)
  return res.data
}

export const fetchCurrentUser = async () => {
  const res = await api.get("/auth/me/")
  return res.data
}

export const logoutUser = async () => {
  await publicApi.post("/auth/logout/")
}
