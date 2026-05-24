import { create } from "zustand";
import type { AppointmentPayload, AppointmentsState } from "../types/Appointments";
import { cancelAppointment, createAppointment, fetchAppointment, fetchAppointments, updateAppointment } from "../api/appointments";
import { UnauthorizedError } from "../api/auth";
import { useLoginStore } from "./useLoginStore";

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
    appointments: null,
    success: false,
    loading: false,
    error: false,
    errorMessage: null,
    getAppointments: async(token) => {

        set({loading: true})

        try {
            const result = await fetchAppointments(token);
            set({loading: false, appointments: result})

        } catch(err) {

            if(err instanceof UnauthorizedError)  {
                try {
                    await useLoginStore.getState().refreshAccessToken();
                    
                    const newToken = useLoginStore.getState().token
    
                    if(newToken) {
                       const result = await fetchAppointments(newToken);
                        set({loading: false, appointments: result})
                        return;
                    }

                } catch(err) {
                    console.log("Refresh token expired or invalid")
                    useLoginStore.getState().logout()
                }
            }

            set({error: true, loading: false})
            throw err;
        }
    },
    getAppointment: async(token, apId) => {
        set({loading: true})
        try {
            const result = await fetchAppointment(token, apId);
            set({loading: false})
            return result;
        } catch(err) {
            
            if(err instanceof UnauthorizedError)  {
                try {
                    await useLoginStore.getState().refreshAccessToken();
                    
                    const newToken = useLoginStore.getState().token
    
                    if(newToken) {
                        const result = await fetchAppointment(newToken, apId);
                        return result
                    }

                } catch(err) {
                    console.log("Refresh token expired or invalid")
                    useLoginStore.getState().logout()
                }
            }
            

            set({ error: true, errorMessage: err.message, loading: false})
            throw err;
        }
    },
    createAppointment: async(payload: AppointmentPayload) => {
        set({loading: true})
        try {
            const created = await createAppointment(payload);
            if(created) set({ success: true, loading: false})
        } catch(err) {
            set({ error: true, errorMessage: err.message, loading: false})

            if(err instanceof UnauthorizedError) 
                return await useLoginStore.getState().refreshAccessToken().catch(() => useLoginStore.getState().logout())

            throw err;
        }
    },
    updateAppointment: async(payload, token, apId) => {
        set({loading: true})
        try {
            await updateAppointment(payload, token, apId)
            console.log("Initial fetch", token)
        } catch(err) {
            
            if(err instanceof UnauthorizedError)  {
                try {
                    await useLoginStore.getState().refreshAccessToken();
                    
                    const newToken = useLoginStore.getState().token
                    
                    if(newToken) {
                        await updateAppointment(payload, newToken , apId);
                        return;
                    }
                    
                } catch(err) {
                    console.log("Refresh token expired or invalid")
                    useLoginStore.getState().logout()
                }
            }
            
            set({ error: true, errorMessage: err.message, loading: false})
            throw err;
        }
    },
    cancelAppointment: async(token, apId) => {
        set({loading: true})
        try {
            await cancelAppointment(token, apId)
            console.log("Initial fetch", token)
        } catch(err) {
            
            if(err instanceof UnauthorizedError)  {
                try {
                    await useLoginStore.getState().refreshAccessToken();
                    
                    const newToken = useLoginStore.getState().token
                    console.log("Refreshed token", newToken)
                    
                    if(newToken) {
                        await cancelAppointment(newToken, apId)
                        return;
                    }
                    
                } catch(err) {
                    console.log("Refresh token expired or invalid")
                    useLoginStore.getState().logout()
                }
            }
            
            set({ error: true, errorMessage: err.message, loading: false})
            throw err;
        }
    },
    clearErrors: () => set({error: false, errorMessage: null})
}))