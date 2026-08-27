import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});