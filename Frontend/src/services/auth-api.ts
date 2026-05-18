import type { Registration } from "../types/Auth";

const registrationURL = import.meta.env.VITE_REGISTER;

export async function register(payload: Registration) {
    if(!registrationURL) {
        throw new Error("VITE_REGISTER url is not defined in .env")
    }

    const res = await fetch(registrationURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    console.log(res)
    
    if(!res.ok) throw new Error("Failed to register patient")
    
    return res.json();

}