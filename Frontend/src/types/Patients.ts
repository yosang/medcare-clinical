export type GuestPatientPayload = {
    firstname: string,
    lastname: string,
    phone: string
}

export interface GuestPatient {
    id?: number,
    firstname: string,
    lastname: string,
    phone: string
}

export interface GuestPatientState {
    patient: GuestPatient | null,
    loading: boolean,
    error: boolean,
    createPatient: (payload: GuestPatientPayload) => Promise<GuestPatient>
}