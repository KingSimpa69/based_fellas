import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "@/styles/holders.module.css"
import delay from "@/functions/delay";
import Owned from "@/components/holders/Owned";
import HorizontalRule from "@/components/HorizontalRule";
import { useWindowSize } from "@/hooks/useWindowSize";

const Holders = ({alert}) => {

    const [loading,setLoading] = useState(true)
    const [addy,setAddy] = useState("")
    const [owned, setOwned] = useState([])
    const router = useRouter()
    const {width} = useWindowSize();

    const getOwned = async(address) => {
        try{
            if (ethers.isAddress(address)){
                const response = await fetch(`/api/getowned?addy=${address}`);
                if (!response.ok) {
                    alert("error","Failed to fetch data")
                }
                const ownedArray = await response.json();
                setOwned(ownedArray)
            } else {
                alert("error","Not a valid ethereum address")
            }
        } catch (error){
            console.log(error)
        } finally {
            setLoading(false)
        }


    }

    const checkForDynamic = async () => {
        await delay(100)
        if(router.query.holders){
          if(router.query.holders[0] !== undefined){
            getOwned(router.query.holders[0])
            setAddy(router.query.holders[0])
          }
        }
    }

    useEffect(() => {
        let mounted = true
        mounted && checkForDynamic()
        return() =>{
            mounted = false
        }
      }, [router])

    return(
        <div className={styles.wrapper}>
        {loading ? <><HorizontalRule /><p className={styles.loading}>Loading...</p></> :
        owned.length !== 0 ? <Owned width={width} addy={addy} ownedArray={owned}/> : <p>This address doesn&quot;t own any fellas!</p>}
        </div>
    )
}

export default Holders