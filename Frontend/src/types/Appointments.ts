import type { Clinic, Doctor } from "./Doctors"

export interface AppointmentPayload {
    AppointmentDate: string,
    Duration: number,
    Note: string,
    PatientId: number,
    DoctorId: number,
    ClinicId: number,
    CategoryId: number,
    StatusId: number
}

export interface AppointmentUpdatePayload {
    appointmentDate?: string,
    duration?: number,
    note?: string,
    doctorId?: number,
    clinicId?: number,
    categoryId?: number,
    statusId?: number
}

export interface AppointmentUpdateForm {
    appointmentDate?: string,
    duration?: number,
    note?: string,
    doctorId?: number,
    clinicId?: number,
    categoryId?: number,
}

export interface Appointment {
    id: number,
    appointmentDate: string,
    duration: number,
    note: string,
    doctor: Doctor,
    category: Categories,
    status: Status,
    clinic: Clinic

}

export interface Categories {
    id: number,
    name: string
}

export interface Status {
    id: number,
    name: string
}

export interface AppointmentsState {
    appointments: Appointment[] | null
    success: boolean
    loading: boolean,
    error: boolean,
    errorMessage: string | null,
    getAppointments: (token: string) => Promise<void>,
    getAppointment: (token: string, apId:number) => Promise<Appointment>
    createAppointment: (payload: AppointmentPayload) => Promise<void>,
    updateAppointment: (payload: AppointmentUpdatePayload, token: string, apId: number) => Promise<void>,
    cancelAppointment: (token: string, apId: number) => Promise<void>,
    clearErrors: () => void
}

export interface CategoriesState {
    categories: Categories[] | null,
    loading: boolean,
    error: boolean,
    fetchCategories: () => Promise<void>
}

export interface StatusState {
    status: Status[] | null,
    loading: boolean,
    error: boolean,
    fetchStatus: () => Promise<void>
}