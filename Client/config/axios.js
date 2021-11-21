import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

export default instance;
