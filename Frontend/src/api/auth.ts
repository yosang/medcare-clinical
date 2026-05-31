import type { Login, Registration } from "../types/Auth";

const refreshURL = import.meta.env.VITE_REFRESH;
const registrationURL = import.meta.env.VITE_REGISTER;
const loginURL = import.meta.env.VITE_LOGIN;
const logoutURL = import.meta.env.VITE_LOGOUT;

async function authFetchHelper(url: string, payload: Login | Registration, customErrorMessage:string = "Fetch was not successful") {
    
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    })

    if (res.status === 204) {
        return;
    }

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

export async function logoutRequest() {
    if(!logoutURL) throw new Error("VITE_LOGOUT url is not defined in .env")

    const res = await fetch(logoutURL, {
        method: "POST",
        credentials: "include"
    });

    if(!res.ok) {
        throw new Error("Failed to logout");
    }
}

export async function refreshToken() {
    if(!refreshURL) throw new Error("VITE_REFRESH url is not defined in .env")

    const res = await fetch(refreshURL, {
      method: "POST",
      credentials: "include"
    });

    if(!res.ok) {
        if(res.status === 401) {
            throw new UnauthorizedError("Accedd denied")
        }
        throw new Error("Failed to refresh access")
    }

    return await res.json();
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message)
    }
}