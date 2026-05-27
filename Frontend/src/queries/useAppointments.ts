import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UnauthorizedError } from "../api/auth";
import { useLoginStore } from "../stores/useLoginStore";
import { cancelAppointment, createAppointment, fetchAppointment, fetchAppointments, updateAppointment } from "../api/appointments";
import type { AppointmentPayload, AppointmentUpdatePayload } from "../types/Appointments";

async function withAuth<T>(cb: ( token:string ) => Promise<T>): Promise<T> {
    const currentToken = useLoginStore.getState().token;

    try {
        return await cb(currentToken || "");
    } catch(err) {
        if(err instanceof UnauthorizedError)  { // handles 401 by attemtping to get a new access token
            try {
                await useLoginStore.getState().refreshAccessToken();
                const newToken = useLoginStore.getState().token

                if(newToken) {
                    return await cb(newToken);
                }

            } catch(err) {
                console.log("Refresh token expired or invalid")
                useLoginStore.getState().logout() // logs out, if the backend refuses the refresh token
            }
        }
        throw err; // throws the error if this wasnt a 401
    }
}

// Read queries
export function useAppointments() {
    
    const token = useLoginStore(s => s.token);
    
    return useQuery({
        queryKey: ["appointments", token],
        queryFn: () => withAuth((token) => fetchAppointments(token)),
        enabled: !!token // only fires the queryFn if there is a token
    })
}

export function useAppointment(apId: number | null) {
    const token = useLoginStore(s => s.token);

    return useQuery({
        queryKey: ["appointments", "appointmentDetail", token, apId],
        queryFn: () => withAuth(token => fetchAppointment(token, apId!)),
        enabled: !!token && apId !== null
    })

}

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
            return withAuth((token) => updateAppointment(payload, token, apId));
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
            return withAuth(token => cancelAppointment(token, apId))
        },
        onSuccess(_data, apId) {
            qc.invalidateQueries({ queryKey: ["appointments", token] });
            qc.invalidateQueries( {queryKey: ["appointments", "appointmentDetail", token, apId] })
        }
    })
}