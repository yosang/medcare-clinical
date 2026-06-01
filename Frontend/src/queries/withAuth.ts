import { UnauthorizedError } from "../api/auth";
import { useLoginStore } from "../stores/useLoginStore";
import { fetchAppointments, fetchAppointment } from "../api/appointments";
/**
 * Helper function used by queryFunctions relying on authentication.
 * - Tries to call the callback function with token in the header.
 * - - If the backend refuses the token (a 401 error is caught), we use the refreshAccessToken function from {@link useLoginStore} to get a new token.
 * - - If the refresh token is refused, we log out the user.
 * - - Otherwise call the callback function again with the newly refreshed access token.
 * - This function is designed as a generic function because its used with callback functions with different return types.
 * - - {@link fetchAppointments} returns a promise with a list of appointments, 
 * - - while {@link fetchAppointment} returns a promise with a single appointment.
 * @param cb Fetch function passed as a callback function.
 */
export default async function withAuth<T>(cb: ( token:string ) => Promise<T>): Promise<T> {
    const currentToken = useLoginStore.getState().token;

    try {
        return await cb(currentToken || "");
    } catch(err) {
        if(err instanceof UnauthorizedError)  { // handles 401 by attemtping to get a new access token
            try {
                await useLoginStore.getState().refreshAccessToken();
                const newToken = useLoginStore.getState().token

                if(newToken) {
                    return await cb(newToken);
                }

            } catch(err) {
                console.log("Refresh token expired or invalid")
                useLoginStore.getState().logout() // logs out, if the backend refuses the refresh token
            }
        }
        throw err; // throws the error if this wasnt a 401
    }
}