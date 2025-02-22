import axios from "axios";
const baseURL = "http://localhost:3000"

export const axiosForm = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json"
    },
    timeout: 10000
})

export const axiosFile = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "multipart/form-data"
    },
    timeout: 10000
})