import { UnauthorizedError } from "../api/auth";
import { useLoginStore } from "../stores/useLoginStore";

// A little helper tries to call the cb function, if it failes, we handle two cases of errors
// If its a 401, we refresh the access token, and call the cb function with the new access token
// If we cant refresh, that means the refresh token is not valid, we then proceed to logout the user
// otherwise throw the error back out
export default async function withAuth<T>(cb: ( token:string ) => Promise<T>): Promise<T> { // This function is generic because some read api calls return json while write api calls are just void
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