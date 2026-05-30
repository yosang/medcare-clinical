import { memo, type TextareaHTMLAttributes } from "react"

export default memo(function TextArea({...props}: {} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
            Note
            <textarea 
                {...props}
            />
            </label>
});