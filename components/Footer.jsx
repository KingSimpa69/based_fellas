import styles from "@/styles/footer.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from "next/image";
import HorizontalRule from "./HorizontalRule";

const Footer = () => {

    let year =  new Date().getFullYear();

    return (
        <><HorizontalRule /><div className={styles.wrapper}>
            <div className={styles.left}>
                <h1 className={styles.h1}>Based Fellas</h1>
                <p className={styles.copyright}>&copy; {year}</p>
            </div>
            <div className={styles.right}>
                <a className={styles.icon} href="https://twitter.com/based_fellas" target="_blank"><FontAwesomeIcon icon="fa-brands fa-twitter" /></a>
                <a className={styles.icon} href="https://discord.com/invite/EVk2Zk2N3z" target="_blank"><FontAwesomeIcon icon="fa-brands fa-discord" /></a>
                <a className={styles.icon} href="https://opensea.io/collection/based-fellas" target="_blank"><Image alt="opensealogo" src={"/images/opensea.png"} width={25} height={25} /></a>
                <a className={styles.icon} href="https://basescan.org/token/0x217ec1ac929a17481446a76ff9b95b9a64f298cf" target="_blank"><Image alt="basescanlogo" src={"/images/basescan.png"} width={25} height={25} /></a>
                <a className={`${styles.icon} ${styles.blockscout}`} href="https://base.blockscout.com/token/0x217Ec1aC929a17481446A76Ff9B95B9a64F298cF" target="_blank"><Image alt="blockscout" src={"/images/blockscout.png"} width={25} height={25} /></a>
                <a className={styles.icon} href="https://github.com/KingSimpa69" target="_blank"><FontAwesomeIcon icon="fa-brands fa-github" /></a>
            </div>
        </div></>
    )
}

export default Footer