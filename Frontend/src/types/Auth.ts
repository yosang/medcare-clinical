export interface Registration {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    dateOfBirth: string,
    nationalIdentityNumber: string,
    password: string,
    isRegistered: boolean
}

export interface Token {
    token: string
}

export interface RegistrationState {
    loading: boolean,
    error: boolean,
    registerPatient: (payload: Registration) => Promise<Token>
}

export interface Login {
    email: string,
    password: string
}

export interface LoginState {
    token: string | null,
    loading: boolean,
    error: boolean,
    loginPatient: (payload: Login) => Promise<void>
    logout: () => void
}