import type { Categories, Status } from "../types/Appointments";
import type { Doctor } from "../types/Doctors";
import { MissingENVError } from "./errors/MissingENVError";

const statusUrl = import.meta.env.VITE_STATUS;
const categoriesUrl = import.meta.env.VITE_CATEGORIES;
const doctorsUrl = import.meta.env.VITE_DOCTORS;
const searchUrl = import.meta.env.VITE_DOCTORS_SEARCH;

/**
 * Retrieves a list of statuses from the backend
 * @returns {Status} List of statuses
 */
export async function fetchStatus(): Promise<Status[]> {
    if(!statusUrl) {
        throw new MissingENVError("VITE_STATUS url is not defined in .env")
    }

    const res = await fetch(statusUrl)

    if(!res.ok) throw new Error("Failed to fetch statuses")

    return res.json();
}

/**
 * Retrieves a list of categories from the backend
 * @returns {Categories} List of categories
 */
export async function fetchCategories(): Promise<Categories[]> {
    if(!categoriesUrl) {
        throw new MissingENVError("VITE_CATEGORIES url is not defined in .env")
    }

    const res = await fetch(categoriesUrl)

    if(!res.ok) throw new Error("Failed to fetch categories")

    return res.json();
}

/**
 * Retrieves a list of doctors from the backend
 * @returns {Doctor} List of doctors
 */
export async function fetchDoctors(): Promise<Doctor[]> {
    if(!doctorsUrl) {
        throw new MissingENVError("VITE_DOCTORS url is not defined in .env")
    }

    const res = await fetch(doctorsUrl)

    if(!res.ok) throw new Error("Failed to fetch doctors")

    return res.json();
}

/**
 * Retrieves a list of doctors from the backend based on search term
 * @returns {Doctor} List of doctors by search
 */
export async function fetchDoctorsBySearch(name: string ): Promise<Doctor[]> {
    if(!searchUrl) {
        throw new MissingENVError("VITE_DOCTOR_SEARCH url is not defined in .env")
    }
    
    const res = await fetch(`${searchUrl}?name=${name}`)

    if(!res.ok) throw new Error("Failed to fetch doctors with search")
    
    return res.json();
}

