import type { ZodObject } from "zod";
import { create } from "zustand"

type ValidationState = {
    validationErrors: string[],
    inputsWithErrors: string[],
    validate: (schema: ZodObject, data: { [key:string]: FormDataEntryValue;} ) => boolean,
    clearErrors: () => void
    errorIdentifier: (key: string) => boolean
}

/**
 * Centralized validation to void duplicated code.
 * - validate takes a schema and a data to validate.
 * - - If validation fails, we populate validationErrors and inputsWithErrors so the client can provide visual feedback on what went wrong.
 */
export const useValidationStore = create<ValidationState>((set, get) => ({
    validationErrors: [],
    inputsWithErrors: [],
    validate: (schema, data): boolean => {
        const validation = schema.safeParse(data);
        
        if(!validation.success) {
            set({
                validationErrors: validation.error.issues.map(err => err.message),
                inputsWithErrors: validation.error.issues.map(err => String(err.path[0])),
            })
            return false
        }
        
        set({ validationErrors: [], inputsWithErrors: [] });
        return true;
    },
    clearErrors: () => {
        set({
            validationErrors: [],
            inputsWithErrors: [],
        })
    },
    errorIdentifier: (key: string) => {
        const errors = get().inputsWithErrors;
        return errors.includes(key);
    }
}))