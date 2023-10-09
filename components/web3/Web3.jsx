import { useAccount, useDisconnect, useNetwork  } from 'wagmi'
import styles from "../../styles/web3.module.css"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { shortenEthAddy } from "@/functions/shortenEthAddy"

const Web3 = () => {

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

    return(
        <div className={`${styles.wrapper} ${isConnected === false ? styles.disconnected :
            chain.id !== 8453 ? styles.disconnected :
             styles.connected }`}>
            <div>
                {isConnected === false ? "Disconnected" :
                 chain.id !== 8453 ? "Wrong Chain" : 
                 "Connected"}
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