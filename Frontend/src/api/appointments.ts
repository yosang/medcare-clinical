import type { Appointment, AppointmentPayload, AppointmentUpdatePayload } from "../types/Appointments";
import { UnauthorizedError } from "./auth";

const appointmentsUrl = import.meta.env.VITE_APPOINTMENTS

/**
 * Fetches appointments for a patient, requires a valid access token with PatientId claim.
 * @param token Access token to attach to the request header.
 */
export async function fetchAppointments<T>(token:string, page?: number, pageSize?: number): Promise<T> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const url = page && pageSize ? `${appointmentsUrl}?page=${page}&itemsPerPage=${pageSize}`:appointmentsUrl

    const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}`}
    })
    
    if(!res.ok) {
        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        throw new Error("Failed to fetch appointments")
    }

    return res.json();
}

/**
 * Fetches a single appointment for a patient, requires a valid access token with PatientId claim.
 * @param token Access token to attach to the request header.
 * @param apId The id of the appointment to fetch.
 */
export async function fetchAppointment(token:string, apId:number): Promise<Appointment> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(!res.ok) {
        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        throw new Error("Failed to fetch appointments")
    }
    
    return res.json();
}

/**
 * Creates an appointment either as a guest or a logged in patient:
 * - Guest users: A guest patient must be created first in order to provide the PatientId in the required payload contract.
 * - Registered users: The application stores patient details in memory after a successful login, including the id which is used in the payload contract.
 * @param payload The payload contract for creating an appointment.
 */
export async function createAppointment(payload:AppointmentPayload): Promise<boolean> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(appointmentsUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) {
        
        if(res.status === 409) {
            const errorObject = await res.json()
            if(errorObject) throw new Error(errorObject.detail);
        }
        
        throw new Error("Failed to create appointment")
}
    return true;
}

/**
 * Updates an appointment as a logged in patient.
 * @param payload The payload contract including changes, the backend supports partial updates.
 * @param token Access token to attach to the request header.
 * @param apId The id of the appointment to update.
 */
export async function updateAppointment(payload:AppointmentUpdatePayload, token: string, apId: number): Promise<void> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type":"application/json" ,"Authorization": `Bearer ${token}`}
    })

    if(res.status === 204) return;

    if(!res.ok) {

        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        if(res.status === 409) {
            const errorObject = await res.json()
            if(errorObject) throw new Error(errorObject.detail);
        }
        
        throw new Error("Failed to update appointment")
    }
}

/**
 * Cancels an appointment by setting its status to cancelled (soft delete).
 * @param token Access token to attach to the request header.
 * @param apId The id of the appointment to cancel.
 */
export async function cancelAppointment(token: string, apId: number): Promise<void> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(res.status === 204) return;

    if(!res.ok) {

        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error("Failed to update appointment")
    }
}