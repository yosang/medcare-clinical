import styles from "./styles/SelectElement.module.css"

import { useCategories } from "../../queries/useLookupQueries";
import Skeleton from "react-loading-skeleton";
import { memo, type SelectHTMLAttributes } from "react";

export default memo(function CategorySelection({ value, onChange, ...props}: {} & SelectHTMLAttributes<HTMLSelectElement>) {
        
        const { data, isLoading, isError } = useCategories();
        
        if(isLoading) return <Skeleton width={200} height={18}/>
        if(isError || !data ) return <p style={{ color: "red" }}>Unable to reach server</p>

        return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
               Category
               <select 
                    value={value}
                    onChange={onChange}
                    className={styles.layout}
                    {...props}
                >
                        <option value="" disabled hidden>
                            -- Select a category --
                        </option>
                        {data.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>                
               </label>
});