import styles from "@/styles/index.module.css"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const OurTeam = ({toggleModal, modalStatus, setMate}) => {

    const openModal = async(mate) =>{
        setMate(mate)
        toggleModal(!modalStatus)
    }

    return(
        <div className={styles.container}>
            <h1>Our Team</h1>
                <div className={styles.teamFlex}>
                    <div className={styles.teamMate}>
                        <div className={styles.matePic}><div onClick={()=>openModal(1)} className={styles.mateOverlay}>More</div><Image src={"/images/cordelle.jpg"} width={200} height={200}/></div>
                        <div className={styles.mateTitle}>cordelleonbase</div>
                        <p>Community Head</p>
                        <div className={styles.mateSocials}>
                            <a href={"https://twitter.com/cordelleonbase"} target="_blank"><FontAwesomeIcon width={30} icon="fa-brands fa-twitter" /></a>
                        </div>
                    </div>
                    <div className={styles.teamMate}>
                        <div className={styles.matePic}><div onClick={()=>openModal(0)} className={styles.mateOverlay}>More</div><Image src={"/images/underdog.jpg"} width={200} height={200}/></div>
                        <div className={styles.mateTitle}>underdog</div>
                        <p>Community Head</p>
                        <div className={styles.mateSocials}>
                            <a href={"https://twitter.com/underdogadam"} target="_blank"><FontAwesomeIcon width={30} icon="fa-brands fa-twitter" /></a>
                        </div>
                    </div>
                    <div className={styles.teamMate}>
                        <div className={styles.matePic}><div onClick={()=>openModal(2)} className={styles.mateOverlay}>More</div><Image src={"/images/kingsimpa.jpg"} width={200} height={200}/></div>
                        <div className={styles.mateTitle}>KingSimpa69</div>
                        <p>Developer</p>
                        <div className={styles.mateSocials}>
                            <a href={"https://linkedin.com/in/alexander-charbonneau-202714215"} target="_blank"><FontAwesomeIcon width={30} icon="fa-brands fa-linkedin" /></a>
                            <a href={"https://github.com/KingSimpa69"} target="_blank"><FontAwesomeIcon width={30} icon="fa-brands fa-github" /></a>
                            <a href={"https://twitter.com/kingsimpa69"} target="_blank"><FontAwesomeIcon width={30} icon="fa-brands fa-twitter" /></a>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default OurTeam