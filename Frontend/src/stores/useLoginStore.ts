import { create } from "zustand";
import { type Login, type LoginState } from "../types/Auth";
import { login } from "../services/auth-api";

export const useLoginStore = create<LoginState>(set => ({
    token: "",
    loading: false,
    error: false,
    loginPatient: async (payload: Login) => {
        set({ loading: false})
        try { 
            const result = await login(payload)
            set({loading: false, token: result.token})
        } catch(err) {
            set({loading: false, error: true})
            throw err;
        }
    },
    logout: () => set({token: ""})
}))