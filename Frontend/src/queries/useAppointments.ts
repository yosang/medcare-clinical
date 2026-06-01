import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoginStore } from "../stores/useLoginStore";
import { cancelAppointment, createAppointment, fetchAppointment, fetchAppointments, updateAppointment } from "../api/appointments";
import type { Appointment, AppointmentPayload, AppointmentUpdatePayload } from "../types/Appointments";

import withAuth from "./withAuth";

type Paginated = {
    data: Appointment[]
    hasNextPage: boolean
}

// Read queries

export function useAppointments() {
    
    const token = useLoginStore(s => s.token);
    
    return useQuery({
        queryKey: ["appointments", token], // This key combination provides caching safety, since every token is unique to each user, no appointments from user A will leak to user B
        queryFn: () => withAuth((currentToken) => fetchAppointments<Appointment[]>(currentToken)),
        enabled: !!token, // only fires the queryFn if there is a token,
    })
}

/**
 * Read query that fetches and stores appointments for a logged in user and returns a paginated result.
 * - This query is only enabled for as long as there is a token available in memory.
 */
export function useAppointmentsPaginated(pageSize: number) {
    
    const token = useLoginStore(s => s.token);
    
    return useInfiniteQuery({
        queryKey: ["appointments", "infinite", token], 
        queryFn: ({ pageParam }) => withAuth((currentToken) => fetchAppointments<Paginated>(currentToken, pageParam, pageSize)),
        enabled: !!token, 
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if(!lastPage.hasNextPage) return;

            return allPages.length + 1;
        }
    })
}

/**
 * Read query that fetches and stores a single appointment for a logged in user.
 * - This query is only enabled for as long as there is a token and apId is passed as an argument.
 * @param apId The id of the appointment to fetch.
 */
export function useAppointment(apId: number | null) {
    const token = useLoginStore(s => s.token);

    return useQuery({
        queryKey: ["appointments", "appointmentDetail", token, apId],
        queryFn: () => withAuth(currentToken => fetchAppointment(currentToken, apId!)),
        enabled: !!token && apId !== null
    })

}

// Mutation queries
/**
 * Write query that creates a new appointment and invalidates previous appointments query.
 */
export function useCreateAppointment() {
    const qc = useQueryClient();
    const token = useLoginStore(s => s.token);

    return useMutation({
        mutationFn: async (payload: AppointmentPayload) => {
            return createAppointment(payload);
        },
        onSuccess: () => {
            if(token) {
                qc.invalidateQueries({ queryKey: ["appointments", token] })
                qc.invalidateQueries({ queryKey: ["appointments", "infinite", token] })
            } // only invalidate if this is a logged-in user
        }
    })
}

/**
 * Write query that updates an existing appointment and invalidates previous appointsments and appointment details query.
 */
export function useUpdateAppointment() {
    const qc = useQueryClient();
    const token = useLoginStore(s => s.token);

    return useMutation({
        mutationFn: async ({ payload, apId }:{payload: AppointmentUpdatePayload, apId: number}) => {
            return withAuth((currentToken) => updateAppointment(payload, currentToken, apId));
        },
        onSuccess(_data, variables) {
            qc.invalidateQueries({ queryKey: ["appointments", token] });
            qc.invalidateQueries({ queryKey: ["appointments", "infinite", token] });
            qc.invalidateQueries( {queryKey: ["appointments", "appointmentDetail", token, variables.apId] })
        }
    })
}

/**
 * Write query that sets an appointment to cancelled status and invalidates previous appointsments and appointment details query.
 */
export function useCancelAppointment() {
    const qc = useQueryClient();
    const token = useLoginStore(s => s.token);
    
    return useMutation({
        mutationFn: async ( apId: number ) => {
            return withAuth(currentToken => cancelAppointment(currentToken, apId))
        },
        onSuccess(_data, apId) {
            qc.invalidateQueries({ queryKey: ["appointments", token] });
            qc.invalidateQueries({ queryKey: ["appointments", "infinite", token] });
            qc.invalidateQueries( {queryKey: ["appointments", "appointmentDetail", token, apId] })
        }
    })
}