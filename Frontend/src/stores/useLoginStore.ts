import { create } from "zustand";
import { type Login, type LoginState } from "../types/Auth";
import { login, logoutRequest, refreshToken } from "../api/auth";

export const useLoginStore = create<LoginState>((set) => ({
    token: null,
    loading: false,
    error: false,
    errorMessage: null,
    loginPatient: async (payload: Login) => {
        set({ loading: false})
        try { 
            const result = await login(payload)
            set({loading: false, token: result.token })
        } catch(err) {
            set({loading: false, error: true, errorMessage: err.message})
            throw err;
        }
    },
    refreshAccessToken: async() => {
        set({ loading: false})
        try { 
            const result = await refreshToken()
            set({loading: false, token: result.token })
        } catch(err) {
            set({ loading: false, error: true })
            throw err;
        }
    },
    setToken: (token) => {
        set({ token })
    },
    logout: async () => {
        try {
            set({ token: null });
            await logoutRequest();
        } catch(err) {
            set({ loading: false, error: true })
            throw err;
        }
    }
}))