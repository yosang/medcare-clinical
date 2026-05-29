export interface Patient {
      id: number,
      firstName: string,
      lastName: string,
      dateOfBirth: string,
      phone: string,
      email: string,
      nationalIdentityNumber: string,
    }
    
export type GuestPatientPayload = {
    firstname: string,
    lastname: string,
    dateOfBirth: string,
    phone: string
}

export interface GuestPatient {
    id?: number,
    firstname: string,
    lastname: string,
    dateOfBirth: string,
    phone: string
}