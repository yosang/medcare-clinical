import { memo, type InputHTMLAttributes } from "react"

export default memo(function DateTimeSelector({...props}:{} & InputHTMLAttributes<HTMLInputElement>) {
    return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
            Date and time
            <input 
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                {...props}
            />
            </label>
})