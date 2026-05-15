import { useEffect, useState } from "react";
import type { Categories } from "../../types/Appointments";
import { fetchCategories } from "../../services/api";
import LoadingSpinner from "../layout/LoadingSpinner";


export default function CategorySelection() {
        const [categories, setCategories] = useState<Categories[] | null>(null)
        const [categoryRequestError, setCategoryRequestError] = useState(false);

        useEffect(() => {
            async function fetch() {
                try {
                    const data = await fetchCategories();
                    setCategories(data)
                } catch(err) {
                    setCategoryRequestError(true);
                    console.error("An error occurred during fetch:", err )
                }
            }
            fetch();
        }, [])

        if(categoryRequestError) return <p style={{ color: "red" }}>Unable to load categories</p>
        if(!categories) return <LoadingSpinner />

        return <select name="CategoryId">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>                
}