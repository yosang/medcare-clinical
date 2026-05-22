import { create } from "zustand"
import type { Registration, RegistrationState } from "../types/Auth";
import { register } from "../api/auth";

export const useRegistrationStore = create<RegistrationState>((set) => ({
    loading: false,
    error: false,
    registerPatient: async(payload:Registration) => {
        set({loading: true})
        try {
            const data = await register(payload);
            set({ loading: false})
            return data;
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({ error: true, loading: false })
            throw err;
        }
    }
}))