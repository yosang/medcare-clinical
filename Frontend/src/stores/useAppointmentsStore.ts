import { create } from "zustand";
import type { AppointmentPayload, AppointmentsState } from "../types/Appointments";
import { createAppointment, fetchAppointments, updateAppointment } from "../services/api";

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
    appointments: null,
    success: false,
    loading: false,
    error: false,
    createAppointment: async(payload: AppointmentPayload) => {
        set({loading: true})
        try {
            const created = await createAppointment(payload);
            if(created) set({ success: true, loading: false})
        } catch(err) {
            set({error: true, loading: false})
            throw err;
        }
    },
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
    updateAppointment: async(payload, token, apId) => {
        set({loading: true})
        try {
            await updateAppointment(payload, token, apId)
        } catch(err) {
            set({error: true, loading: false})
            throw err;
        }
    }
}))