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
        if (!sessionError && session) {
            const token = session.access_token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    }
)

axiosForm.interceptors.response.use(
    (response) => {
        return response
    }
)
