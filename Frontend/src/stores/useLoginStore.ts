import { create } from "zustand";
import { type Login, type LoginState } from "../types/Auth";
import { login } from "../services/auth-api";

export const useLoginStore = create<LoginState>(set => ({
    userId: null,
    token: "",
    loading: false,
    error: false,
    loginPatient: async (payload: Login) => {
        set({ loading: false})
        try { 
            const result = await login(payload)
            console.log(result)
            set({loading: false, token: result.token, userId: result.userId})
        } catch(err) {
            set({loading: false, error: true})
            throw err;
        }
    },
    logout: () => set({token: ""})
}))