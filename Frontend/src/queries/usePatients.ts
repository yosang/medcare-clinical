import { useMutation, useQuery } from "@tanstack/react-query";
import { useLoginStore } from "../stores/useLoginStore";
import withAuth from "./withAuth";
import { createGuestPatient, getPatientDetails } from "../api/patients";
import type { GuestPatientPayload } from "../types/Patients";
import type { Registration } from "../types/Auth";
import { register } from "../api/auth";

// Read queries
/**
 * Read query that fetches and stores patient details for a logged in patient
 */
export function usePatient() {
    const token = useLoginStore(s => s.token);

    return useQuery({
        queryKey: ["patient", token],
        queryFn: () => withAuth((currentToken) => getPatientDetails(currentToken)),
        enabled: !!token
    })
}

// Mutation queries
/**
 * Write query that creates a new guest patient with non-sensitive details
 */
export function useCreatePatient() {
    return useMutation({
        mutationFn: async (payload: GuestPatientPayload) => {
            return createGuestPatient(payload)
        }
    })
}

/**
 * Write query that registers a new patient with sensitive details
 */
export function useRegisterPatient() {
    return useMutation({
        mutationFn: async(payload: Registration) => {
            return register(payload)
        }
    })
}