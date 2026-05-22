import { create } from "zustand";
import { type StatusState } from "../types/Appointments";
import { fetchStatus } from "../api/shared";

export const useStatusStore = create<StatusState>((set) => ({
    status: null,
    loading: false,
    error: false,
    fetchStatus: async() => {
        set({ loading: true })
        try {
            const data = await fetchStatus();
            set({ status: data, loading: false })
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({ error: true, loading: false })
    }
    }
}))