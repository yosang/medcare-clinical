import type { Login, Registration } from "../types/Auth";

const registrationURL = import.meta.env.VITE_REGISTER;
const loginURL = import.meta.env.VITE_LOGIN;

async function authFetchHelper(url: string, payload: Login | Registration, customErrorMessage:string = "Fetch was not successful") {
    
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) {
        const errorObject = await res.json()
        if(errorObject) throw new Error(errorObject.detail);
        
        throw new Error(customErrorMessage)
    }

    return res.json();
}

export async function register(payload: Registration) {
    if(!registrationURL) throw new Error("VITE_REGISTER url is not defined in .env")

    return await authFetchHelper(registrationURL, payload, "Failed to register patient")
}

export async function login(payload: Login) {
    if(!loginURL) throw new Error("VITE_LOGIN url is not defined in .env")

    return await authFetchHelper(loginURL, payload, "Failed to login patient")
}
