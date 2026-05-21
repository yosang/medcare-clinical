import { create } from "zustand";
import type { AppointmentPayload, AppointmentsState } from "../types/Appointments";
import { cancelAppointment, createAppointment, fetchAppointment, fetchAppointments, updateAppointment } from "../api/appointments";

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
            throw err;
        }
    },
    updateAppointment: async(payload, token, apId) => {
        set({loading: true})
        try {
            await updateAppointment(payload, token, apId)
        } catch(err) {
            set({ error: true, errorMessage: err.message, loading: false})
            throw err;
        }
    },
    cancelAppointment: async(token, apId) => {
        set({loading: true})
        try {
            await cancelAppointment(token, apId)
        } catch(err) {
            set({ error: true, errorMessage: err.message, loading: false})
            throw err;
        }
    },
    clearErrors: () => set({error: false, errorMessage: null})
}))