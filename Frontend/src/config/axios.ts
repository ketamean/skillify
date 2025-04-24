import { supabase } from "@/supabaseClient";
import axios from "axios";
import { toast } from "sonner";
const baseURL = "http://localhost:3000"
// const oauthServer = "http://localhost:3000/"

export const axiosForm = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json"
    },
    timeout: 100000,
    withCredentials: true,
})

export const axiosFile = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "multipart/form-data"
    },
    timeout: 100000
})

const requestNewAccessToken = async() => {

}

axiosForm.interceptors.request.use(
    async (config) => {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            toast.error("Please login to continue")
            // redirect to login page
            return Promise.reject(sessionError);
        }
    
        if (!session) {
            // Handle redirecting to login page '/login'
            toast.error("Please login to continue")
            return Promise.reject(new Error("No session found"));
        }
      
        const token = session.access_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)

axiosForm.interceptors.response.use(
    (response) => {
        return response
    }
)
