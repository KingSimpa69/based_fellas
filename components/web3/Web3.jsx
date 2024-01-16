import { useAccount, useDisconnect, useNetwork  } from 'wagmi'
import { useEffect } from 'react'
import styles from "../../styles/web3.module.css"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { shortenEthAddy } from "@/functions/shortenEthAddy"
import { useRouter } from 'next/router'

const Web3 = ({chain,toggleMenu, goodGood}) => {

    const { open } = useWeb3Modal()
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()
    const route = useRouter();

    const web3connect = async () => {
        if(isConnected === false){
            await open()
            return
        } else {
            disconnect()
            return
        }
    }

    const checkGoodToTx = () => {
        chain === undefined ? goodGood({connected:false,network:false}) :
        chain.id === 8453 || chain.id === 84532 ? goodGood({connected:true,network:true}) :
        goodGood({connected:true,network:false})
    }

    useEffect(() => {
      let mounted = true
      mounted && checkGoodToTx()
      return () => {
        mounted = false
      }
    }, [route,isConnected, address])
    

    useEffect(()=>{
        toggleMenu(false)
    },[isConnected])

    return(
        <div className={`${styles.wrapper} ${isConnected === false ? styles.disconnected :
            chain.id === 8453 || chain.id === 84532 ? styles.connected :
             styles.disconnected }`}>
            <div className={`${isConnected === false ? styles.networkFlash :
                chain.id === 8453 || chain.id === 84532 ? styles.network :
                styles.networkFlash }`} onClick={(e)=>{
                e.currentTarget.innerText === "Unknown Network" ? open({ view: 'Networks' }) :
                e.currentTarget.innerText === "Disconnected" ? open({ view: 'Connect' }) : open({ view: 'Networks' })}}>
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