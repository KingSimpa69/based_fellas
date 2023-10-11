import styles from "@/styles/menu.module.css"
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import delay from "@/functions/delay";
import Web3 from "./web3/Web3";

const Menu = ({menu, toggleMenu, setGlobalCSS0, setGlobalCSS1}) => {

    const [css0,setCss0] = useState("hidden")
    const [initalRender,setInitialRender] = useState(true);

    const router = useRouter()

    const changePage = async (route) => {
      if(route!==router.pathname){
        setGlobalCSS0("animate__animated animate__fadeOut animate__faster");
        await delay(200)
        toggleMenu(!menu)
        await delay(420)
        setGlobalCSS1("hidden")
        router.push(`${route}`)
        await delay(900)
        setGlobalCSS1("")
        setGlobalCSS0("animate__animated animate__fadeIn animate__faster");
      } else {
        toggleMenu(!menu)
      }
    }

      const closeMenu = async () => {
        setCss0("animate__animated animate__fadeOutTopRight")
        await delay(420)
        setCss0("hidden")
      }      
      
      useEffect(()=>{
        if(initalRender === false){
            menu === true ? setCss0("animate__animated animate__fadeInTopRight") : closeMenu()
        } else {
            setInitialRender(!initalRender)
        }
      },[menu])

      

return (
    <div className={`${css0} ${styles.wrapper}`}>
      <Web3 toggleMenu={toggleMenu} />
        <p onClick={()=>{changePage("/")}} className={router.pathname!=="/"?styles.item:`${styles.item} ${styles.active}`}>Home</p>
        <p onClick={()=>{changePage("/collection")}} className={router.pathname!=="/collection"?styles.item:`${styles.item} ${styles.active}`}>Collection</p>
        <p onClick={()=>{changePage("/owned")}} className={router.pathname!=="/owned"?styles.item:`${styles.item} ${styles.active}`}>Owned</p>
    </div>
)
}

export default Menu