export interface Clinic {
    id: number,
    name: string,
    phone: string,
    email: string,
    address: string,
    postalCode: string
}

export interface Specialty {
    id: number,
    name: string
}

export interface Doctor {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    specialty: Specialty,
    clinic: Clinic
}

export interface DoctorState {
    doctors: Doctor[] | null,
    loading: boolean,
    error: boolean,
    fetchDoctors: () => Promise<void>,
    getClinicId: (doctorId:string) => string
}