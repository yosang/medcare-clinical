import { useEffect } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useCategoriesStore } from "../../stores/useCategoriesStore";


export default function CategorySelection() {
        const { categories, loading, error, fetchCategories } = useCategoriesStore();

        useEffect(() => {
           if(!categories) fetchCategories();
        }, [categories, fetchCategories])

        if(error) return <p style={{ color: "red" }}>Unable to load categories</p>
        if(!categories || loading ) return <LoadingSpinner />

        return <select name="CategoryId">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>                
}