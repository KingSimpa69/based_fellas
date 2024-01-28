import styles from "@/styles/market.module.css"
import {useEffect, useState} from 'react'

const MarketControlz = ({setShowWallet, showWallet, owner,provider,delistingModal,setDelistingModal,listingModal,setListingModal,liquidateModal,setLiquidateModal,adminModal,setAdminModal}) => {

    const [isAdmin,setIsAdmin] = useState(false)
    const [chain,setChain] = useState(0)

    const blockExplorers = {
        8453:"https://base.blockscout.com",
        84532:"https://base-sepolia.blockscout.com"
    }

    useEffect(()=>{
        const getNetwork = async () => {
            const { chainId } = await provider.provider.getNetwork()
            setChain(parseInt(chainId))
        }

        if(owner,provider){
            provider.address.toString().toLowerCase() === owner.toString().toLowerCase() ? setIsAdmin(true) : setIsAdmin(false)
            getNetwork()
        }
    },[owner,provider])

    useEffect(() => {
        if(chain!==0){

        }

    }, [chain])
    

    return(
        <div className={styles.marketControlz}>
            <p onClick={()=>setShowWallet(!showWallet)} className={chain!==0?null:styles.hidden}>{showWallet?"Market":"Wallet"}</p>
            <p onClick={()=>setListingModal(!listingModal)}>List</p>
            <p onClick={()=>setDelistingModal(!delistingModal)}>Delist</p>
            <p onClick={()=>setLiquidateModal(!liquidateModal)}>Liquidate</p>
            {<p className={isAdmin?null:styles.hidden} onClick={()=>setAdminModal(!adminModal)}>Admin</p>}
        </div>
    )
}

export default MarketControlz