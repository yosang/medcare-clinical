import type { Login, Registration, Token } from "../types/Auth";

const refreshURL = import.meta.env.VITE_REFRESH;
const registrationURL = import.meta.env.VITE_REGISTER;
const loginURL = import.meta.env.VITE_LOGIN;
const logoutURL = import.meta.env.VITE_LOGOUT;

/**
 * Authenticates an existing patient
 * - A successful login returns an access token in the json response and a refresh token as httpOnly secured cookie
 * - Since the backend is the one setting the refresh token in the cookies, the browser must identify itself as an accepted origin, hence credentials: "include".
 * - credentials: "include" requires the frontend to be listed as an AllowedOrigin in the backend CORS configuration
 * - The access token is saved in memory with a zustand store, and is used on every query that requires Bearer authentication.
 * - The refresh token is used whenever the backend refuses the access token, in which case we use the refreshToken function to retrieve a new access token and save it memory in order to proceed with our requests.
 * - This provides with an extra layer of security, if the access token is stolen, its lives short and little much damage can be done. However the refresh token is harder to steal due to how its configured.
 * @param payload Payload contract required for login
 * @returns {Token} Access token is returned in the json response
 */
export async function login(payload: Login): Promise<Token> {
    if(!loginURL) throw new Error("VITE_LOGIN url is not defined in .env")
        
    const res = await fetch(loginURL, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    })

    if(!res.ok) {
        
        if(res.status === 401) {
            const errorObject = await res.json()
            if(errorObject) throw new Error(errorObject.detail);
        }
        
        throw new Error("Failed to login")
    }

    return await res.json();
}

/**
 * Registers a new patient
 * - If an existing unregistered patient exists, the backend will use that existing entity and update it to avoid duplicates.
 * - If an existing registered patient exists, the backend responds with 409 (Conflict). We intentionally forward that message here as we know no revealing information will be shown.
 * - For any other errors, a generic message is shown.
 * @param payload Payload contract required for registration
 */
export async function register(payload: Registration): Promise<void> {
    if(!registrationURL) throw new Error("VITE_REGISTER url is not defined in .env")

    const res = await fetch(registrationURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })

    if(res.status === 204) return;

    if(!res.ok) {

        if(res.status === 409) {
            const errorObject = await res.json()
            if(errorObject) throw new Error(errorObject.detail);
        }
        
        throw new Error("Failed to register")
    }
}

/**
 * Logs out the frontend client.
 * - This is an additional step to the logout method on the zustand store useLoginStore, which only sets the access token saved in memory to null.
 * - Since the httpOnly cookie cannot be deleted programatically from the frontend, we have to send a request to the backend to remove it.
 * - Just like with login, the frontend has to identify itself as an allowed origin in order to get its refresh_token removed from the cookies.
 */
export async function logoutRequest(): Promise<void> {
    if(!logoutURL) throw new Error("VITE_LOGOUT url is not defined in .env")

    const res = await fetch(logoutURL, {
        method: "POST",
        credentials: "include"
    });

    if(!res.ok) {
        throw new Error("Failed to logout");
    }
}

/**
 * Sends of a request to the backend for a new access token, using the refresh token cookie.
 * - The token will validate the refresh token
 * - If validation is successful, the frontend receives a new access token
 */
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