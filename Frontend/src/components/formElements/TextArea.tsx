export default function TextArea({...props}) {
    return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
            Note
            <textarea 
                {...props}
            />
            </label>
}