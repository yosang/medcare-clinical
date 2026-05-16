import { create } from "zustand";
import type { CategoriesState } from "../types/Appointments";
import { fetchCategories } from "../services/api";

export const useCategoriesStore = create<CategoriesState>((set) => ({
    categories: null,
    loading: false,
    error: false,
    fetchCategories: async() => {
        set({ loading: true })
        try {
            const data = await fetchCategories();
            set({ categories: data, loading: false })
        } catch(err) {
            console.error("An error occurred during fetch:", err )
            set({ error: true, loading: false })
        }
    }
}))