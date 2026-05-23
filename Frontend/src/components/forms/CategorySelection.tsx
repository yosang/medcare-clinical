import { useEffect } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useCategoriesStore } from "../../stores/useCategoriesStore";

import styles from "./SelectElement.module.css"

export default function CategorySelection({...props}) {
        const { categories, loading, error, fetchCategories } = useCategoriesStore();

        useEffect(() => {
           if(!categories) fetchCategories();
        }, [categories, fetchCategories])

        if(error) return <p style={{ color: "red" }}>Unable to load categories</p>
        if(!categories || loading ) return <LoadingSpinner />

        return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
               Category
               <select name="CategoryId" {...props} className={styles.layout}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>                
               </label>
}