import { StateCreator } from 'zustand';
import Cookies from 'js-cookie';

export interface UserState {
    token: string | null;
    decodedToken: Record<string, any> | null;
    userRoles: string[];
    expiresAt: string | null;
    setUserRoles: (userRoles: string[] | null) => void;
    userInfo: {
        id: number | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        type: string[] | null;
        status: string | null;
        externalId: string | null;
        avatar: string | null;
    } | null;
    setUserInfo: (userInfo: {
        id: number | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        type: string[] | null;
        status: string | null;
        externalId: string | null;
        avatar: string | null;
    } | null) => void;
    setToken: (token: string | null, expiresAt: string | null) => void;
    clearToken: () => void;
}

const createUserSlice: StateCreator<UserState> = (set) => ({
    token: Cookies.get('token') || null,
    decodedToken: (() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                return JSON.parse(atob(token.split('.')[1]));
            } catch (error) {
                console.error('Failed to decode token', error);
                return null;
            }
        }
        return null;
    })(),
    userInfo: (() => {
        const userInfo = Cookies.get('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    })(),
    userRoles: (() => {
        const userRoles = Cookies.get('userRoles');
        return userRoles ? JSON.parse(userRoles) : [];
    })(),
    expiresAt: Cookies.get('expiresAt') || null,
    setUserInfo: (userInfo: any) => {
        Cookies.set('userInfo', JSON.stringify(userInfo));
        set({ userInfo });
    },
    setUserRoles: (userRoles: any) => {
        Cookies.set('userRoles', JSON.stringify(userRoles));
        set({ userRoles });
    },
    setToken: (token: string | null, expiresAt: string | null) => {
        if (token) {
            Cookies.set('token', token);
            Cookies.set('expiresAt', expiresAt || '');
            let decodedToken = null;
            try {
                decodedToken = JSON.parse(atob(token.split('.')[1]));
            } catch (error) {
                console.error('Failed to decode token', error);
            }
            set({ token, decodedToken, expiresAt });
        } else {
            Cookies.remove('token');
            Cookies.remove('expiresAt');
            set({ token: null, decodedToken: null, expiresAt: null });
        }
    },
    clearToken: () => {
        Cookies.remove('token');
        Cookies.remove('expiresAt');
        Cookies.remove('userInfo');
        Cookies.remove('userRoles');
        set({ token: null, decodedToken: null, userInfo: null, expiresAt: null });
    },
});

export default createUserSlice;
