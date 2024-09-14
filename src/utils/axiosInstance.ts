import axios from 'axios';
import Router from 'next/router';
import Cookies from 'js-cookie';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
    const token = Cookies.get('token');
    const expiresAtStr = Cookies.get('expiresAt');
    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

    if (token && expiresAt && new Date().getTime() < expiresAt.getTime()) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        Cookies.remove('token');
        Cookies.remove('expiresAt');
        Cookies.remove('userInfo');
        Router.push('/');
        return Promise.reject('Unauthorized');
    }

    return config;
}, error => Promise.reject(error));

export default axiosInstance;
