import { useState } from "react";
import styles from "@/styles/market.module.css"

const BlockScoutItem = ({i,setId,setListingModal,listingModal}) => {

    const [mouseOn,setMouseOn] = useState(false)

    const openListing = () => {
        setListingModal(!listingModal)
        setId(i.id)
    }

    return(
        <div onMouseOver={()=>setMouseOn(true)} onMouseOut={()=>setMouseOn(false)} onClick={()=>openListing()} className={styles.itemContainer}>
            <div className={mouseOn?styles.overlay:styles.hidden}>List</div>
                <img width={200} height={200} src={i.image_url} />
                <p className={styles.itemName}>{i.metadata.name}</p>
            <div className={styles.horizontalFlex}>
            <p className={styles.itemID}>{i.id}</p>
            </div>
        </div>
    )
}

export default BlockScoutItem