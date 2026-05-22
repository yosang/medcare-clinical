import { create } from "zustand";
import { type Login, type LoginState } from "../types/Auth";
import { login } from "../api/auth";

export const useLoginStore = create<LoginState>(set => ({
    token: null,
    loading: false,
    error: false,
    loginPatient: async (payload: Login) => {
        set({ loading: false})
        try { 
            const result = await login(payload)
            set({loading: false, token: result.token })
        } catch(err) {
            set({loading: false, error: true})
            throw err;
        }
    },
    logout: () => set({token: ""})
}))