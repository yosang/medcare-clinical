import { create } from "zustand";
import type { Appointment, AppointmentsState } from "../types/Appointments";
import { createAppointment } from "../services/api";

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
    success: false,
    loading: false,
    error: false,
    createAppointment: async(payload: Appointment) => {
        set({loading: true})
        try {
            const created = await createAppointment(payload);
            if(created) set({ success: true, loading: false})
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({error: true, loading: false})
            throw err;
        }
    }
}))