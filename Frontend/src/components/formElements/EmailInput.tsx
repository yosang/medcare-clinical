import { forwardRef, type Ref } from "react"
import styles from "./Inputs.module.css"

type Props = {
    labelText: string
}

const EmailInput = forwardRef(({labelText}:Props, ref: Ref<HTMLInputElement> | undefined) => {
    return <label className={styles.layout}>
                    {labelText}
                    <input 
                        ref={ref}
                        required
                        name="email"
                        type="email"
                        />
            </label>
})

export default EmailInput;