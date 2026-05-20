export interface Patient {
      id: number,
      firstName: string,
      lastName: string,
      phone: string,
      email: string,
      dateOfBirth: string,
      nationalIdentityNumber: string,
      isRegistered: boolean
}

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
    loading: boolean,
    error: boolean,
    createPatient: (payload: GuestPatientPayload) => Promise<GuestPatient>
}