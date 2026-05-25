import type { ReactNode } from "react";
import InfoCard from "./InfoCard";
import styles from "./SideInfo.module.css";

type Props = {
    children: ReactNode
    firstHeaderText: string
    secondHeaderText: string
    infoText: string
}

export default function SideInfo({ children, firstHeaderText, secondHeaderText, infoText }:Props) {
    return <div className={styles.layout}>
            <div className={styles.header}>
                <h3 className={styles.headerTextFirst}>{firstHeaderText}</h3>
                <h1 className={styles.headerTextSecond}>{secondHeaderText}</h1>
            </div>
            {children}
                <InfoCard>
                    {infoText}
                </InfoCard>
        </div>
}