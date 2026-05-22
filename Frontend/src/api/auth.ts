import type { Login, Registration } from "../types/Auth";

const registrationURL = import.meta.env.VITE_REGISTER;
const loginURL = import.meta.env.VITE_LOGIN;

export async function register(payload: Registration) {
    if(!registrationURL) {
        throw new Error("VITE_REGISTER url is not defined in .env")
    }

    const res = await fetch(registrationURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) throw new Error("Failed to register patient")
    
    return res.json();

}

export async function login(payload: Login) {
    if(!loginURL) {
        throw new Error("VITE_LOGIN url is not defined in .env")
    }

    const res = await fetch(loginURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) throw new Error("Failed to login patient")
    
    return res.json();

}