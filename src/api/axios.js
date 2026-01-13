import axios from "axios";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../utils/token";

const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
})

// REQUEST INTERCEPTOR: Attach the token to every outgoing request
api.interceptors.request.use(
    (config)=>{
        const token=getAccessToken()
        // console.log("Token Sent:",token)
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

//RESPONSE INTERCEPTOR: Catch 401 errors and refresh the token
api.interceptors.response.use(
    (response)=>response,  // If the request succeeds, just move on
    async(error)=>{
        const originalRequest=error.config

        if(error.response?.status===401 && !originalRequest._retry){
            originalRequest._retry=true // Mark as retrying to avoid infinite loops

            try{
                const refresh=getRefreshToken()
                if(!refresh) throw new Error("No refresh token available")

                // We use standard axios here, NOT our 'api' instance to avoid an infinite loop of 401s
                const res = await axios.post("http://localhost:8000/api/auth/token/refresh/", {refresh}
                );

                const { access } = res.data;

                setTokens(access,refresh);

                // Update the original request with the new token and try again
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch(refreshError){
                // If refreshing fails (e.g., refresh token is also expired)
                console.error("Refresh token expired. Logging out...");
                clearTokens();
                window.dispatchEvent(new Event("force-logout"));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default api