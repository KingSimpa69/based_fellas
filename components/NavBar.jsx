import styles from "@/styles/navbar.module.css"
import Image from "next/image"

export const NavBar = ({toggleMenu, menu}) => {
    return(
    <div className={styles.navbarwrap}>
    <div className={styles.brand}>
        <div className={styles.imagecont}>
            <Image alt="logo" width={32} height={24} src={"/images/1.png"}/>
        </div>
        <h1>Based Fellas</h1>
    </div>
    <div>
        <p onClick={()=>{toggleMenu(!menu)}} className={styles.purpbutton}>
            Menu
        </p>
    </div>
    </div>
    )
}