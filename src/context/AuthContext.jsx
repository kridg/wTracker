import React, { createContext, useState , useContext, useEffect } from 'react'
import { clearTokens, setTokens, getAccessToken } from '../utils/token'
import {jwtDecode} from "jwt-decode";

export const AuthContext=createContext(null)

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)

    // Restore auth on refresh
    useEffect(()=>{
        const token=getAccessToken()
        if(token){
            try{
                const decoded=jwtDecode(token)
                setUser(decoded)
            }catch{
                clearTokens()
            }
        } setLoading(false)
    },[])

    useEffect(()=>{
        const handleLogout=()=>{
            clearTokens()
            setUser(null)
        }
        window.addEventListener("force-logout",handleLogout)
        return()=>window.removeEventListener("force-logout",handleLogout)
    },[])

    const login=(access,refresh)=>{
        setTokens(access,refresh)
        const decoded=jwtDecode(access)
        setUser(decoded)
    }

    const logout=()=>{
        clearTokens()
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user,login,logout,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext)