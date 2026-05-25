import { create } from "zustand"
import type { Registration, RegistrationState } from "../types/Auth";
import { register } from "../api/auth";

export const useRegistrationStore = create<RegistrationState>((set) => ({
    loading: false,
    error: false,
    errorMessage: null,
    registerPatient: async(payload:Registration) => {
        set({loading: true})
        try {
            await register(payload);
            set({ loading: false})
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({ error: true, errorMessage: err.message, loading: false })
            throw err;
        }
    },
    clearErrors: () => set({ error: false, errorMessage: null})
}))