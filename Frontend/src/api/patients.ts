import type { GuestPatientPayload, Patient } from "../types/Patients";
import { UnauthorizedError } from "./auth";

const patientsMeUrl = import.meta.env.VITE_PATIENTS_ME;
const patientsGuestUrl = import.meta.env.VITE_PATIENTS_GUEST;

// GET: Private
export async function getPatientDetails(token: string): Promise<Patient> {
    if(!patientsMeUrl) {
        throw new Error("patientsGuestUrl url is not defined in .env")
    }

    const res = await fetch(patientsMeUrl, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`},
        credentials: "include"
    })

    if(!res.ok) {
        
        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        throw new Error("Failed to fetch patient")
    }
    
    return res.json();
}

// POST: Public
export async function createGuestPatient(payload: GuestPatientPayload): Promise<Patient> {
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