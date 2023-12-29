import styles from "@/styles/navbar.module.css"
import Image from "next/image"
import Link from "next/link"

export const NavBar = ({toggleMenu, menu}) => {
    return(
    <div className={styles.navbarwrap}>
    <div className={styles.brand}>
    <Link href="/"><Image alt="logo" width={32} height={32} src={"/images/1.png"}/></Link>
    <Link href="/"><h1>Based Fellas</h1></Link>
    </div>
    <div>
        <p onClick={()=>{toggleMenu(!menu)}} className={styles.purpbutton}>
            Menu
        </p>
    </div>
    </div>
    )
}