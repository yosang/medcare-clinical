import type { Appointment, AppointmentPayload, AppointmentUpdatePayload } from "../types/Appointments";
import { UnauthorizedError } from "./auth";

const appointmentsUrl = import.meta.env.VITE_APPOINTMENTS

// GET appointments: Private
export async function fetchAppointments(token:string): Promise<Appointment []> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(appointmentsUrl, {
        headers: { "Authorization": `Bearer ${token}`}
    })
    
    if(!res.ok) {
        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        throw new Error("Failed to fetch appointments")
    }

    return res.json();
}

// GET appointment: Private
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

// POST appointments: Public + Private
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
        
        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error("Failed to create appointment")
}
    return true;
}

// POST appointments: Private
export async function updateAppointment(payload:AppointmentUpdatePayload, token: string, apId: number): Promise<void> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type":"application/json" ,"Authorization": `Bearer ${token}`}
    })

    if(!res.ok) {

        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error("Failed to update appointment")
    }
}

// POST appointments: Private
export async function cancelAppointment(token: string, apId: number): Promise<void> {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(!res.ok) {

        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error("Failed to update appointment")
    }
}