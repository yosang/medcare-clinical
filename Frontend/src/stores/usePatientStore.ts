import { create } from "zustand"
import { type GuestPatientPayload, type PatientState } from "../types/Patients"
import { createGuestPatient, getPatientDetails } from "../api/patients";

export const usePatientStore = create<PatientState>((set) => ({
    patient: null,
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
    },
    getPatient: async(token) => {
        set({loading: true})
        try {
            const data = await getPatientDetails(token);
            set({ loading: false, patient: data})
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({ error: true, loading: false })
            throw err;
        }
    }
}))