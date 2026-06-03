import type { Appointment, AppointmentPayload, AppointmentUpdatePayload } from "../types/Appointments";

import { MissingENVError } from "./errors/MissingENVError";
import { UnauthorizedError } from "./errors/UnauthorizedError";

/**
 * Extracts the url for the backend API endpoint from .env file. If not configured an error is thrown, which will be caught and handled by Tanstack QueryClient in main.tsx
 * @returns {string} The url
 */
const getBaseUrl = (): string => {
    const url = import.meta.env.VITE_APPOINTMENTS

    if(!url) throw new MissingENVError("VITE_APPOINTMENTS url is not defined in .env")
    
    return url;
}

/**
 * Fetches appointments for a patient, requires a valid access token with PatientId claim.
 * @param token Access token to attach to the request header.
 */
export async function fetchAppointments<T>(token:string, page?: number, pageSize?: string, sort?:string, status?: string): Promise<T> {
    const url = new URL(getBaseUrl());

    if(page) url.searchParams.append("page", String(page));
    if(pageSize) url.searchParams.append("itemsPerPage", pageSize);
    if(sort) url.searchParams.append("sort", sort);
    if(status) url.searchParams.append("status", status);

    const res = await fetch(url.toString(), {
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

    const res = await fetch(`${getBaseUrl()}/${apId}`, {
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

    const res = await fetch(getBaseUrl(), {
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

    const res = await fetch(`${getBaseUrl()}/${apId}`, {
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

    const res = await fetch(`${getBaseUrl()}/${apId}`, {
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