import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

console.log('My backend url is ' + import.meta.env.VITE_BACKEND_URL, '\n\n');

try {
    const response = api.get('/check')
    console.log(response.data);
} catch (error) {
    console.log(error);
}

export default api;