import withAuth from "../queries/withAuth";
import type { GuestPatientPayload, Patient } from "../types/Patients";
import { MissingENVError } from "./errors/MissingENVError";
import { UnauthorizedError } from "./errors/UnauthorizedError";

const getBaseUrl = () => {
    const url = import.meta.env.VITE_PATIENTS

    if(!url) throw new MissingENVError("VITE_APPOINTMENTS url is not defined in .env")
    
    return url;
}

/**
 * Fetches details for a logged in patient.
 * - If the backend responds with a 401, we throw {@link UnauthorizedError}.
 * - UnauthorizedErrors will be handled by helper function {@link withAuth}, which fetches a new access token using refresh token cookie.
 * @param token Access token required for authentication.
 * @returns {Patient} The patient object.
 */
export async function getPatientDetails(token: string): Promise<Patient> {

    const res = await fetch(getBaseUrl(), {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`}
    })

    if(!res.ok) {
        
        if(res.status === 401) throw new UnauthorizedError("Access token is invalid");

        throw new Error("Failed to fetch patient")
    }
    
    return res.json();
}

/**
 * Creates a new guest patient with a limited set of details such as firstname, lastname, date of birth and phone.
 * @param payload Payload contract required.
 * @returns {Patient} The patient created.
 */
export async function createGuestPatient(payload: GuestPatientPayload): Promise<Patient> {

    const res = await fetch(getBaseUrl(), {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) throw new Error("Failed to create guest patient")
    
    return res.json();
}