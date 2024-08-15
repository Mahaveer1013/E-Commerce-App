import axios from 'axios';
import CryptoJS from 'crypto-js';


const encryptApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

const secretKey = import.meta.env.VITE_SECRET_KEY;

const encryptValue = (value) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
    } catch (error) {
        console.error('Error during value encryption:', error);
        throw error;
    }
};


const decryptValue = (encryptedValue) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
            throw new Error('Decryption failed or result is empty');
        }
        console.log(typeof decryptedText, typeof JSON.parse(decryptedText));

        return JSON.parse(decryptedText);
    } catch (error) {
        console.error('Error during decryption:', error);
        throw error;
    }
};

// Request interceptor to encrypt data
encryptApi.interceptors.request.use((config) => {
    if (config.data) {

        config.data = encryptValue(config.data);
        config.headers['Content-Type'] = 'application/octet-stream';
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to decrypt data
encryptApi.interceptors.response.use(
    (response) => {
        // Check if the response has encrypted data and an encryption indicator
        if (response.data && response.data.enc) {
            response.data = decryptValue(response.data.data); // Assuming response.data contains a `data` field with the actual content
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.data && error.response.data.message) {
            console.error('API Error:', error.response.data.message); // Log the error message
            return Promise.reject(new Error(error.response.data.message));
        } else {
            console.error('API Error:', error.message);
            return Promise.reject(error);
        }
    }
);


export default encryptApi;