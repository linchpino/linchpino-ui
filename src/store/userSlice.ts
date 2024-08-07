import { StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserState {
    token: string | null;
    decodedToken: Record<string, any> | null;
    setToken: (token: string | null) => void;
    clearToken: () => void;
}

const createUserSlice: StateCreator<UserState> = (set) => ({
    token: null,
    decodedToken: null,
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
    clearToken: () => {
        set({ token: null, decodedToken: null });
    },
});

const useUserStore = persist(
    createUserSlice,
    {
        name: 'userToken',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            token: state.token,
            decodedToken: state.decodedToken,
        }),
    }
);

export default useUserStore;
