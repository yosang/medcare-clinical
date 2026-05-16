export interface Appointment {
    AppointmentDate: Date,
    Note: string,
    PatientId: 1,
    DoctorId: 1,
    ClinicId: 1,
    CategoryId: 1,
    StatusId: 1
}

export interface Categories {
    id: number,
    name: string
}

export interface Status {
    id: number,
    name: string
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