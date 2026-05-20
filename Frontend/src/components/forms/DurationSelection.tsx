export default function DurationSelection({...props}) {
    return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
            Duration
            <select {...props} >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
            </select>
            </label>
}