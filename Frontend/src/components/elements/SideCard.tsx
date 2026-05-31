import { ShieldCheck } from "lucide-react";

import styles from "./styles/SideCard.module.css"

export default function SideCard( { 
    imageLink = "https://i.imgur.com/8WNM1hA.png",
    headerText = "Placeholder header",
    contentText = "Pllacerholder content text",
    footerText = "Placeholder footer text"
}:{ 
    imageLink?: string
    headerText: string
    contentText: string
    footerText: string
}) {
        return <div className={styles.sideCard}>
                    <div className={styles.text}>
                        <h2>{headerText}</h2>
                        <p>{contentText}</p>
                        <p><ShieldCheck />{footerText}</p>
                    </div>
                    <img src={imageLink} alt="SideCard Hero Image"/>
                </div>
}