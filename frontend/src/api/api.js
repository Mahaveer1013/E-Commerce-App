import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, 
});

console.log('My backend url is '+ import.meta.env.VITE_BACKEND_URL, '\n\n');


export default api;