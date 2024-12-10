import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define a more robust User interface
export interface User {
    id?: number;
    fullname?: string;
    email?: string;
    role?: string;
    permission?: boolean;
    department?: string;
}

interface UserState {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const useUserStore = create(
    persist<UserState>(
        (set) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
            updateUser: (userData) => set((state) => ({
                user: state.user ? { ...state.user, ...userData } : null
            }))
        }),
        {
            name: 'userStore',
            storage: createJSONStorage(() => localStorage)
        }
    )
);