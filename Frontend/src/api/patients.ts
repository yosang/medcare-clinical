import type { GuestPatientPayload } from "../types/Patients";

const patientsMeUrl = import.meta.env.VITE_PATIENTS_ME;
const patientsGuestUrl = import.meta.env.VITE_PATIENTS_GUEST;

// GET: Private
export async function getPatientDetails(token: string) {
    if(!patientsMeUrl) {
        throw new Error("patientsGuestUrl url is not defined in .env")
    }

    const res = await fetch(patientsMeUrl, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(!res.ok) throw new Error("Failed to fetch patient")
    
    return res.json();
}

// POST: Public
export async function createGuestPatient(payload: GuestPatientPayload) {
    if(!patientsGuestUrl) {
        throw new Error("patientsGuestUrl url is not defined in .env")
    }

    const res = await fetch(patientsGuestUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) throw new Error("Failed to create guest patient")
    
    return res.json();
}