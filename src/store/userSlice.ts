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
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User) => void;
    clearToken: () => void;
    clearUser: () => void;
}

const createUserSlice: StateCreator<UserState> = (set) => ({
    token: null,
    user: null,
    setToken: (token: string | null) => {
        set({ token});
    },
    setUser: (user: User) => set({ user }),
    clearToken: () => set({ token: null}),
    clearUser: () => set({ user: null }),
});

const useUserStore = persist(
    createUserSlice,
    {
        name: 'userToken',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            token: state.token,
            user: state.user,
        }),
    }
);

export default useUserStore;
