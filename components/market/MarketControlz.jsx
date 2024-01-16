import styles from "@/styles/market.module.css"
import {useEffect, useState} from 'react'

const MarketControlz = ({owner,provider,delistingModal,setDelistingModal,listingModal,setListingModal,liquidateModal,setLiquidateModal,adminModal,setAdminModal}) => {

    const [isAdmin,setIsAdmin] = useState(false)

    useEffect(()=>{
        if(owner,provider){
            provider.address.toString().toLowerCase() === owner.toString().toLowerCase() ? setIsAdmin(true) : setIsAdmin(false)
        }
    },[owner,provider])

    return(
        <div className={styles.marketControlz}>
            <p onClick={()=>setListingModal(!listingModal)}>List</p>
            <p onClick={()=>setDelistingModal(!delistingModal)}>Delist</p>
            <p onClick={()=>setLiquidateModal(!liquidateModal)}>Liquidate</p>
            {<p className={isAdmin?null:styles.hidden} onClick={()=>setAdminModal(!adminModal)}>Admin</p>}
        </div>
    )
}

export default MarketControlz