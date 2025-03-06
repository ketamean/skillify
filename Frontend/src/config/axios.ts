import axios from "axios";
const baseURL = "http://localhost:3000"
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

const requestNewAccessToken = async() => {

}

axiosJson.interceptors.request.use(
    // (config) => {
    //     const token = localStorage.getItem("token");
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
