import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchDoctors } from "../api/shared";
import type { Doctor } from "../types/Doctors";

/**
 * Read query that fetches and stores categories
 */
export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategories()
    })
} 

/**
 * Read query that fetches and stores doctors
 */
export function useDoctors() {
    return useQuery({
        queryKey: ["doctors"],
        queryFn: () => fetchDoctors()
    })
}

// Little helper function to get clinic id from doctors list
export function findClinicIdByDoctorId(doctors: Doctor[] | undefined, doctorId: string): string | null {
    const doc = doctors?.find(d => String(d.id) == doctorId)

    if(!doc) return null;

    return String(doc.clinic.id)
}