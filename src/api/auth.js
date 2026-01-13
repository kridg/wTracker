import api from "./axios"
import publicApi from "./publicAxios"

export const loginUser=async(data)=>{
    const res=await publicApi.post("/auth/login/",data)
    return res.data
}

export const registerUser=async(data)=>{
    const res=await publicApi.post("auth/register/",data)
    return res.data
}