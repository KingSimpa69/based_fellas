import { useAccount, useDisconnect, useNetwork  } from 'wagmi'
import { useEffect } from 'react'
import styles from "../../styles/web3.module.css"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { shortenEthAddy } from "@/functions/shortenEthAddy"

const Web3 = ({toggleMenu, goodGood}) => {

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

    const checkGoodToTx = () => {
        isConnected === false ? goodGood(false) :
        chain.id === 8453 || chain.id === 84532 ? goodGood(true) :
        goodGood(false)
    }

    useEffect(() => {
      let mounted = true
      mounted && checkGoodToTx()
      return () => {
        mounted = false
      }
    }, [isConnected, address, chain])
    

    useEffect(()=>{
        toggleMenu(false)
    },[isConnected])

    return(
        <div className={`${styles.wrapper} ${isConnected === false ? styles.disconnected :
            chain.id === 8453 || chain.id === 84532 ? styles.connected :
             styles.disconnected }`}>
            <div className={`${isConnected === false ? styles.networkFlash :
                chain.id === 8453 || chain.id === 84532 ? null :
                styles.networkFlash }`} onClick={(e)=>{
                e.currentTarget.innerText === "Unknown Network" ? open({ view: 'Networks' }) :
                e.currentTarget.innerText === "Disconnected" ? open({ view: 'Connect' }) : null}}>
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