import type { Appointment } from "../types/Appointments";
import type { GuestPatientPayload } from "../types/Patients";

const createAppointmentUrl = import.meta.env.VITE_CREATE_APPOINTMENT;
const createPatientUrl = import.meta.env.VITE_CREATE_GUEST_PATIENT;
const statusUrl = import.meta.env.VITE_STATUS;
const categoriesUrl = import.meta.env.VITE_CATEGORIES;
const doctorsUrl = import.meta.env.VITE_DOCTORS;
const searchUrl = import.meta.env.VITE_DOCTORS_SEARCH;

export async function fetchStatus() {
    if(!statusUrl) {
        throw new Error("VITE_STATUS url is not defined in .env")
    }

    const res = await fetch(statusUrl)

    if(!res.ok) throw new Error("Failed to fetch statuses")

    return res.json();
}

export async function fetchCategories() {
    if(!categoriesUrl) {
        throw new Error("VITE_CATEGORIES url is not defined in .env")
    }

    const res = await fetch(categoriesUrl)

    if(!res.ok) throw new Error("Failed to fetch categories")

    return res.json();
}

export async function fetchDoctors() {
    if(!doctorsUrl) {
        throw new Error("VITE_DOCTORS url is not defined in .env")
    }

    const res = await fetch(doctorsUrl)

    if(!res.ok) throw new Error("Failed to fetch doctors")

    return res.json();
}

export async function fetchDoctorsBySearch(name: string ) {
    if(!searchUrl) {
        throw new Error("VITE_DOCTOR_SEARCH url is not defined in .env")
    }
    
    if(!name) throw new Error("Doctors name cannot be empty.")

    const res = await fetch(`${searchUrl}?name=${name}`)

    if(!res.ok) throw new Error("Failed to fetch doctors with search")
    
    return res.json();
}

export async function createGuestPatient(payload: GuestPatientPayload) {
    if(!createPatientUrl) {
        throw new Error("VITE_CREATE_GUEST_PATIENT url is not defined in .env")
    }

    const res = await fetch(createPatientUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) throw new Error("Failed to create guest patient")
    
    return res.json();

}


export async function createAppointment(payload:Appointment) {
    if(!createAppointmentUrl) {
        throw new Error("VITE_CREATE_APPOINTMENT url is not defined in .env")
    }

    const res = await fetch(createAppointmentUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) {
        
        const text = await res.text()
        if(text) throw new Error(text);
        
        throw new Error("Failed to create appointment")
}
    return true;
}