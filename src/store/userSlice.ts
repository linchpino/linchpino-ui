import { StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    type: string[] | null;
    status: string | null;
    externalId: string | null;
    avatar: string | null;
}

export interface UserState {
    token: string | null;
    decodedToken: Record<string, any> | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User) => void;
    clearToken: () => void;
    clearUser: () => void;
}

const createUserSlice: StateCreator<UserState> = (set) => ({
    token: null,
    decodedToken: null,
    user: null,
    setToken: (token: string | null) => {
        let decodedToken = null;
        if (token) {
            try {
                decodedToken = JSON.parse(atob(token.split('.')[1]));
            } catch (error) {
                console.error('Failed to decode token', error);
            }
        }
        set({ token, decodedToken });
    },
    setUser: (user: User) => set({ user }),
    clearToken: () => set({ token: null, decodedToken: null }),
    clearUser: () => set({ user: null }),
});

const useUserStore = persist(
    createUserSlice,
    {
        name: 'userToken',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            token: state.token,
            decodedToken: state.decodedToken,
            user: state.user,
        }),
    }
);

export default useUserStore;
