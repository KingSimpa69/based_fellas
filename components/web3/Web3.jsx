import { useAccount, useDisconnect, useNetwork  } from 'wagmi'
import { useEffect } from 'react'
import styles from "../../styles/web3.module.css"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { shortenEthAddy } from "@/functions/shortenEthAddy"

const Web3 = ({toggleMenu}) => {

    const { open } = useWeb3Modal()
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork()

    const web3connect = async () => {
        if(isConnected === false){
            await open()
            return
        } else {
            await disconnect()
            return
        }
    }

    useEffect(()=>{
        toggleMenu(false)
    },[isConnected])

    return(
        <div className={`${styles.wrapper} ${isConnected === false ? styles.disconnected :
            chain.id === 8453 || 84532 ? styles.connected :
             styles.disconnected }`}>
            <div>
                {isConnected === false ? "Disconnected" :
                 chain.id === 8453 ? "BASE" : 
                 chain.id === 84532 ? "BASE SEPOLIA":
                 "Unknown Network"}
            </div>
            <div onClick={()=>open({ view: 'Account' })} className={isConnected === false ? "hidden" : styles.addy}>
                {address !== undefined ? shortenEthAddy(address) : null}
            </div>
            <div onClick={()=>web3connect()} className={styles.connectButton} >
                {isConnected === false ? "Connect" : `Disconnect`}
            </div>
        </div>
    )
}

export default Web3