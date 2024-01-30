import styles from "@/styles/market.module.css"
import HorizontalRule from "@/components/HorizontalRule"
import TestMints from "@/components/market/TestMints"
import SelectProject from "@/components/market/SelectProject"
import { useNetwork } from "wagmi"
import { useRouter } from "next/router"
import delay from "@/functions/delay"
import { useState, useEffect } from "react"
import MarketDataTable from "@/components/market/MarketDataTable"

const Market = ({setWriting, setGlobalCSS0, setGlobalCSS1, goodToTx, alert}) => {

    const router = useRouter()
    const pathRegex = /\/([^\/]+)\//;
    const pathMatch = router.asPath.match(pathRegex);
    const currentPath = pathMatch ? pathMatch[1] : null;
    const { chain } = useNetwork();
    const [showTestMints,setShowTestMints] = useState(false)

    const changePage = async (route) => {
        if(route!==router.asPath && "/"+currentPath!==route){
          setGlobalCSS0("animate__animated animate__fadeOut animate__faster");
          await delay(200)
          setGlobalCSS1("hidden")
          router.push(`${route}`)
          await delay(600)
          setGlobalCSS1("")
          setGlobalCSS0("animate__animated animate__fadeIn animate__faster");
        } else {
          toggleMenu(!menu)
        }
      }

useEffect(()=>{
  chain !== undefined && chain.id === 84532 ? setShowTestMints(true) : setShowTestMints(false)
},[chain])


    return(
        <div className={styles.wrapper}>
            <HorizontalRule />
                <h1 className={styles.h1}>Market</h1>
            <HorizontalRule />
            <SelectProject setWriting={setWriting} alert={alert} chain={chain} goodToTx={goodToTx} changePage={changePage} />
            {showTestMints && <TestMints setWriting={setWriting} alert={alert}/>}
            <MarketDataTable changePage={changePage} />
        </div>
    )
}

export default Market