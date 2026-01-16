import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', 
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
    
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Unauthorized access, logging out...');
 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;