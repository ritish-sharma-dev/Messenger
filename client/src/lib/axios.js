import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,//SETTING A GLOBAL DEFAULT BASE URL FOR ALL AXIOS REQUESTS.
    withCredentials: true, // THIS ALLOWS BROWSER TO SAVE AND SEND COOKIES CROSS-ORIGIN
})