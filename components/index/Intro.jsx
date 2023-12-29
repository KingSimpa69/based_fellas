import styles from "@/styles/index.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { shortenEthAddy } from "@/functions/shortenEthAddy"

const Intro = ({alert,width}) => {

    const copyToClipboard = () => {
        navigator.clipboard.writeText("0x217ec1ac929a17481446a76ff9b95b9a64f298cf");
        alert("success","Copied!")
    }

    return(
        <div className={styles.container}>
            <h1>BASED FELLAS</h1>
            <p>THE VERY FIRST 10K PFP NFT COLLECTION LAUNCHED ON BASE</p>
            <div onClick={()=>copyToClipboard()} className={styles.ctc}><div>{width>800?"0x217Ec1aC929a17481446A76Ff9B95B9a64F298cF":shortenEthAddy("0x217Ec1aC929a17481446A76Ff9B95B9a64F298cF")}</div><div className={styles.ctci}><FontAwesomeIcon icon="fa-regular fa-copy" /></div></div>
            <div className={styles.ctcd}>Copy to clipboard</div>
        </div>
    )
}

export default Intro