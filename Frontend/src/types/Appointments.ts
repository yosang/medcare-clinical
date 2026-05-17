export interface Appointment {
    AppointmentDate: string,
    Duration: number,
    Note: string,
    PatientId: number,
    DoctorId: number,
    ClinicId: number,
    CategoryId: number,
    StatusId: number
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
    success: boolean
    loading: boolean,
    error: boolean,
    createAppointment: (payload: Appointment) => Promise<void>
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