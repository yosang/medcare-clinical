import { create } from "zustand"
import { type GuestPatientPayload, type GuestPatientState } from "../types/Patients"
import { createGuestPatient } from "../api/api";

export const usePatientStore = create<GuestPatientState>((set) => ({
    loading: false,
    error: false,
    createPatient: async(payload:GuestPatientPayload) => {
        set({loading: true})
        try {
            const data = await createGuestPatient(payload);
            set({ loading: false})
            return data;
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({ error: true, loading: false })
            throw err;
        }
    }
}))