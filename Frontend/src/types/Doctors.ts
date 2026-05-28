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
    image: string
}