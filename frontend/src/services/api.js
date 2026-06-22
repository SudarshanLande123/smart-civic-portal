import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export default api;


//this is for the sending JWT token automatically
api.interceptors.request.use(
    (config)=>{
        const userInfo = 
            JSON.parse(
                localStorage.getItem("userInfo")
            );
        
        if(userInfo?.token){
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    }
)