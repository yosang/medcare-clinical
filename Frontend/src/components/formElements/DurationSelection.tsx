import styles from "./SelectElement.module.css"

export default function DurationSelection({...props}) {
    return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
            Duration
            <select {...props} defaultValue="" className={styles.layout}>
                <option value="" disabled hidden > -- Select a duration -- </option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
            </select>
            </label>
}