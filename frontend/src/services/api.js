import axios from "axios";
const api = axios.create({
    baseURL: "https://smart-civic-portal.onrender.com/api"
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