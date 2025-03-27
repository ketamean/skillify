import axios from "axios";
const baseURL = "http://localhost:3000"
import { supabase } from '../supabaseClient'
// const oauthServer = "http://localhost:3000/"

export const axiosJson = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json"
    },
    timeout: 10000,
    withCredentials: true,
})

export const axiosFile = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "multipart/form-data"
    },
    timeout: 10000
})

axiosJson.interceptors.request.use(
    // async (config) => {
    //     const token = (await supabase.auth.getSession()).data.session?.access_token;
    //         // i love typescript, chứ không thôi cũng không biết nên chấm làm sao cho ra access_token :))
    //     if (token) {
    //         config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    // }
)

axiosJson.interceptors.response.use(
    // (response) => {
        
    // }
)

axiosFile.interceptors.request.use(
    // async (config) => {
    //     const token = (await supabase.auth.getSession()).data.session?.access_token;
    //         // i love typescript, chứ không thôi cũng không biết nên chấm làm sao cho ra access_token :))
    //     if (token) {
    //         config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    // }
)

axiosFile.interceptors.response.use(
    // (response) => {
        
    // }
)