import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoginStore } from "../stores/useLoginStore";
import { cancelAppointment, createAppointment, fetchAppointment, fetchAppointments, updateAppointment } from "../api/appointments";
import type { AppointmentPayload, AppointmentUpdatePayload } from "../types/Appointments";

import withAuth from "./withAuth";

// Read queries
export function useAppointments() {
    
    const token = useLoginStore(s => s.token);
    
    return useQuery({
        queryKey: ["appointments", token],
        queryFn: () => withAuth((currentToken) => fetchAppointments(currentToken)),
        enabled: !!token // only fires the queryFn if there is a token
    })
}

export function useAppointment(apId: number | null) {
    const token = useLoginStore(s => s.token);

    return useQuery({
        queryKey: ["appointments", "appointmentDetail", token, apId],
        queryFn: () => withAuth(currentToken => fetchAppointment(currentToken, apId!)),
        enabled: !!token && apId !== null
    })

}

// Mutation queries
export function useCreateAppointment() {
    const qc = useQueryClient();
    const token = useLoginStore(s => s.token);

    return useMutation({
        mutationFn: async (payload: AppointmentPayload) => {
            return createAppointment(payload);
        },
        onSuccess: () => {
            if(token) qc.invalidateQueries({ queryKey: ["appointments", token] }) // only invalidate if this is a logged-in user
        }
    })
}

export function useUpdateAppointment() {
    const qc = useQueryClient();
    const token = useLoginStore(s => s.token);

    return useMutation({
        mutationFn: async ({ payload, apId }:{payload: AppointmentUpdatePayload, apId: number}) => {
            return withAuth((currentToken) => updateAppointment(payload, currentToken, apId));
        },
        onSuccess(_data, variables) {
            qc.invalidateQueries({ queryKey: ["appointments", token] });
            qc.invalidateQueries( {queryKey: ["appointments", "appointmentDetail", token, variables.apId] })
        }
    })
}

export function useCancelAppointment() {
    const qc = useQueryClient();
    const token = useLoginStore(s => s.token);
    
    return useMutation({
        mutationFn: async ( apId: number ) => {
            return withAuth(currentToken => cancelAppointment(currentToken, apId))
        },
        onSuccess(_data, apId) {
            qc.invalidateQueries({ queryKey: ["appointments", token] });
            qc.invalidateQueries( {queryKey: ["appointments", "appointmentDetail", token, apId] })
        }
    })
}