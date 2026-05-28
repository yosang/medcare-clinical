import { create } from "zustand";
import type { Appointment } from "../types/Appointments";

type AppointmentStoreState = {
    upcomingAppointment: Appointment | null,
    setUpcomingAppointment: (appointment: Appointment) => void
    clearUpcomingAppointment: () => void
}

export const useAppointmentStore = create<AppointmentStoreState>((set) => ({
    upcomingAppointment: null,
    setUpcomingAppointment: (appointment) => set({ upcomingAppointment: appointment }),
    clearUpcomingAppointment: () => set({ upcomingAppointment:null})
}))