import styles from "@/styles/menu.module.css"
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import delay from "@/functions/delay";
import Web3 from "./web3/Web3";

const Menu = ({menu, toggleMenu, setGlobalCSS0, setGlobalCSS1}) => {

    const [css0,setCss0] = useState("hidden")
    const [initalRender,setInitialRender] = useState(true);
    const router = useRouter()
    const pathRegex = /\/([^\/]+)\//;
    const pathMatch = router.asPath.match(pathRegex);
    const currentPath = pathMatch ? pathMatch[1] : null;

    const changePage = async (route) => {
      if(route!==router.asPath && "/"+currentPath!==route){
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
        setCss0("animate__animated animate__fadeOut animate__slower")
        await delay(420)
        setCss0("hidden")
      }      
      
      useEffect(()=>{
        if(initalRender === false){
            menu === true ? setCss0("animate__animated animate__fadeIn animate__faster") : closeMenu()
        } else {
            setInitialRender(!initalRender)
        }
      },[menu])


return (
    <div className={`${css0} ${styles.wrapper}`}>
      <Web3 toggleMenu={toggleMenu} />
        <p onClick={()=>{changePage("/")}} className={router.asPath!=="/"?styles.item:`${styles.item} ${styles.active}`}>Home</p>
        <p onClick={()=>{changePage("/collection")}} className={router.asPath!=="/collection"&&currentPath!=="collection"?styles.item:`${styles.item} ${styles.active}`}>Collection</p>
        <p onClick={()=>{changePage("/owned")}} className={router.asPath!=="/owned"?styles.item:`${styles.item} ${styles.active}`}>Owned</p>
        <p onClick={()=>{changePage("/holders")}} className={router.asPath!=="/holders"&&currentPath!=="holders"?styles.item:`${styles.item} ${styles.active}`}>Holders</p>
        {/*<p onClick={()=>{changePage("/chests")}} className={router.asPath!=="/chests"&&currentPath!=="chests"?styles.item:`${styles.item} ${styles.active}`}>Chests</p>*/}
    </div>
)
}

export default Menu