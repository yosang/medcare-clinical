import { forwardRef, memo, type InputHTMLAttributes, type Ref } from "react"

import styles from "./styles/Inputs.module.css"

type Props = {
    labelText: string,
    name?: string
} & InputHTMLAttributes<HTMLInputElement>

const EmailInput = forwardRef(({labelText, name, ...props}:Props, ref: Ref<HTMLInputElement> | undefined) => {
    return <label className={styles.layout}>
                    {labelText}
                    <input 
                        ref={ref}
                        required
                        name={name}
                        type="email"
                        {...props}
                        />
            </label>
})

export default memo(EmailInput);