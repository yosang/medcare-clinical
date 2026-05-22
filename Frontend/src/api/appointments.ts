import type { AppointmentPayload, AppointmentUpdatePayload } from "../types/Appointments";

const appointmentsUrl = import.meta.env.VITE_APPOINTMENTS

// GET appointments: Private
export async function fetchAppointments(token:string) {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(appointmentsUrl, {
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(!res.ok) throw new Error("Failed to fetch appointments")
    
    return res.json();
}

// GET appointment: Private
export async function fetchAppointment(token:string, apId:number) {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(!res.ok) throw new Error("Failed to fetch appointment")
    
    return res.json();
}

// POST appointments: Public + Private
export async function createAppointment(payload:AppointmentPayload) {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(appointmentsUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) {
        
        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error("Failed to create appointment")
}
    return true;
}

// POST appointments: Private
export async function updateAppointment(payload:AppointmentUpdatePayload, token: string, apId: number) {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type":"application/json" ,"Authorization": `Bearer ${token}`}
    })

    if(!res.ok) {
        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error("Failed to update appointment")
    }
}

// POST appointments: Private
export async function cancelAppointment(token: string, apId: number) {
    if(!appointmentsUrl) {
        throw new Error("VITE_APPOINTMENTS url is not defined in .env")
    }

    const res = await fetch(`${appointmentsUrl}/${apId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(!res.ok) {
        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error("Failed to update appointment")
    }
}