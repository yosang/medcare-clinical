import { create } from "zustand";
import { type DoctorState } from "../types/Doctors";
import { fetchDoctors } from "../api/api";

export const useDoctorsStore = create<DoctorState>((set, get) => ({
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
    },
    getClinicId: (doctorId) => {
        const doc = get().doctors?.find(d => String(d.id) == doctorId)

        if(!doc) throw new Error("Unable to find doctor")

        return String(doc.clinic.id);
    }
}))