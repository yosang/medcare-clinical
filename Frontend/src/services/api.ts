const searchUrl = import.meta.env.VITE_DOCTORS_SEARCH;


export async function fetchDoctors(name: string ) {
    if(!searchUrl) {
        throw new Error("VITE_DOCTOR_SEARCH url is not defined in .env")
    }
    
    if(!name) throw new Error("Doctors name cannot be empty.")

    const res = await fetch(`${searchUrl}?name=${name}`)

    if(!res.ok) throw new Error("Failed to fetch doctors with search")
    
    return res.json();
}