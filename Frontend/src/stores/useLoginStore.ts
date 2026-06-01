import { create } from "zustand";
import { type Login, type LoginState } from "../types/Auth";
import { login, logoutRequest, refreshToken } from "../api/auth";

/**
 * Simple Zustand store that takes care of token storage, login, registration and logout operations as well as refreshing the access token.
 * Ive decided to use a zustand store instead of tanstack for this because of the following justifications:
 * - Its perfect for client-wide global state: Im using the token in multiple places, and zustand provides us with synchronous access through useLoginStore.getState().token outside of React components.
 * - - With tanstack there would be a lot more boilerplate code
 * - Persistance: The token lives in memory for as long as the app lives or browser refresh (which im handling in App.jsx every time it mounts using refreshAccessToken).
 * - - Caching is not needed for a token: While we want cached server data to expire to avoid stale data, thats not what we want for a token. The token expires by itself.
 */
export const useLoginStore = create<LoginState>((set) => ({
    token: null,
    loading: false,
    error: false,
    errorMessage: null,
    loginPatient: async (payload: Login) => {
        set({ loading: true})
        try { 
            const result = await login(payload)
            set({loading: false, token: result.token })
        } catch(err) {
            set({loading: false, error: true, errorMessage: err.message})
            throw err;
        }
    },
    refreshAccessToken: async() => {
        set({ loading: true})
        try { 
            const result = await refreshToken()
            set({loading: false, token: result.token })
        } catch(err) {
            set({ loading: false, error: true })
            throw err;
        }
    },
    setToken: (token) => {
        set({ token })
    },
    logout: async () => {
        set({ loading: true})
        try {
            set({ token: null });
            await logoutRequest();
        } catch(err) {
            set({ loading: false, error: true })
            throw err;
        }
    },
    clearErrors: () => set({ error: false, errorMessage: null})
}))