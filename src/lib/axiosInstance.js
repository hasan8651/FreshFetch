import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api', 
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});


axiosInstance.interceptors.request.use(
    async (config) => {

        const session = await getSession();
        
        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401 || status === 403) {
            console.error('Unauthorized access - Logging out...');
    
            if (typeof window !== 'undefined') {
                await signOut({ callbackUrl: '/login' });
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;