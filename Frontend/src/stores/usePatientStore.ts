import { create } from "zustand"
import { type GuestPatientPayload, type PatientState } from "../types/Patients"
import { createGuestPatient, getPatientDetails } from "../api/patients";
import { UnauthorizedError } from "../api/auth";
import { useLoginStore } from "./useLoginStore";

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
            
            if(err instanceof UnauthorizedError)  {
                try {
                    await useLoginStore.getState().refreshAccessToken();
                    
                    const newToken = useLoginStore.getState().token
                    
                    if(newToken) {
                        const result = await getPatientDetails(newToken);
                        set({loading: false, patient: result})
                        return;
                    }

                } catch(err) {
                    console.log("Refresh token expired or invalid")
                    useLoginStore.getState().logout()
                }
            }

            set({ error: true, loading: false })
            throw err;
        }
    }
}))