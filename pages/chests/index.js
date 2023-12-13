import styles from "../../styles/chests.module.css"
import { useAccount } from 'wagmi'
import Intro from "@/components/chests/Intro"
import CaseSelect from "@/components/chests/ChestSelect"
import HorizontalRule from "@/components/HorizontalRule"

export default function Chests() {

    const { isConnected, address } = useAccount()

    return(
    <>
        <HorizontalRule />
        <div className={styles.body}>
            {isConnected ? <Intro /> : <div>Not Connected</div>}
            {isConnected ? <CaseSelect /> : <div>Not Connected</div>}
        </div>
    </>
    )
}