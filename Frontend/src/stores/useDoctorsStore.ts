import { create } from "zustand";
import { type DoctorState } from "../types/Doctors";
import { fetchDoctors } from "../services/api";

export const useDoctorsStore = create<DoctorState>((set) => ({
    doctors: null,
    loading: false,
    error: false,
    fetchDoctors: async() => {
        set({ loading: true  })
        try {
            const data = await fetchDoctors();
            set({ doctors: data, loading: false})
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({ error: true, loading: false })
            throw err;
        }
    }
}))