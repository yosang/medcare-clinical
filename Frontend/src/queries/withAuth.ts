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
        //  console.log("attempting fetch with auth")
        
        return await cb(currentToken || "");
    } catch(err) {
        if(err instanceof UnauthorizedError)  {
            // console.log("refreshing token...: ", currentToken)
            try {
                await useLoginStore.getState().refreshAccessToken();
                const newToken = useLoginStore.getState().token
                // console.log("token refreshed: ", newToken)

                if(newToken) {
                    return await cb(newToken);
                }

            } catch(err) {
                console.log("Refresh token expired or invalid")
                useLoginStore.getState().logout()
            }
        }
        throw err; // throws the error if this wasnt a 401
    }
}