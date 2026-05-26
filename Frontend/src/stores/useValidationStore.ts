import type { ZodObject } from "zod";
import { create } from "zustand"

type ValidationState = {
    validationErrors: string[],
    inputsWithErrors: string[],
    validate: (schema: ZodObject, data: { [key:string]: FormDataEntryValue;} ) => void,
    clearErrors: () => void
}

export const useValidationStore = create<ValidationState>((set) => ({
    validationErrors: [],
    inputsWithErrors: [],
    validate: (schema, data) => {
        const validation = schema.safeParse(data);
        if(!validation.success) {
            set({
                validationErrors: validation.error.issues.map(err => err.message),
                inputsWithErrors: validation.error.issues.map(err => String(err.path[0])),
            })
            return;
        }
    },
    clearErrors: () => {
        set({
            validationErrors: [],
            inputsWithErrors: [],
        })
    }
    
}))