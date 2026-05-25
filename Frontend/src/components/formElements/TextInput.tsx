import { forwardRef, type InputHTMLAttributes, type Ref } from "react"
import styles from "./Inputs.module.css"

type Props = {
    labelText?: string,
    name?: string
} & InputHTMLAttributes<HTMLInputElement>

const TextInput = forwardRef( ( { labelText, name, ...props}:Props, ref: Ref<HTMLInputElement> | undefined) => {
    return <label className={styles.layout}>
                    {labelText}
                    <input 
                        ref={ref}
                        required
                        name={name}
                        type="text"
                        {...props}
                        />
            </label>
})

export default TextInput;