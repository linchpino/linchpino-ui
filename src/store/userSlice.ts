import { StateCreator } from 'zustand';

export interface UserState {
    token: string | null;
    setToken: (token: string | null) => void;
}

const createUserSlice: StateCreator<UserState> = (set) => ({
    token: null,
    setToken: (token: string | null) => set({ token }),
});

export default createUserSlice;
