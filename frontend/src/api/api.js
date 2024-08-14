import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, 
});

api.interceptors.request.use((config) => {
    if (config.data) {
        console.log(config);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;