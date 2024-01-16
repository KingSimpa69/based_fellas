import styles from "@/styles/market.module.css"
import { useState } from "react";
import formatETH from "@/functions/formatETH";

const Item = ({metaData,price,id}) => {

    const [mouseOn,setMouseOn] = useState(false)

    const imgURL = metaData.image.replace('ipfs://', 'https://ipfs.io/ipfs/');

    return(
        <div onMouseOver={()=>setMouseOn(true)} onMouseOut={()=>setMouseOn(false)} className={styles.itemContainer}>
            <div className={mouseOn?styles.overlay:styles.hidden}>Buy</div>
                <img width={200} height={200} src={imgURL} />
                <p className={styles.itemName}>{metaData.name}</p>
            <div className={styles.horizontalFlex}>
            <p className={styles.itemPrice}>{formatETH(parseFloat(price)/10**18)} ETH</p>
            <p className={styles.itemID}>{id.toString()}</p>
            </div>
        </div>
    )
}

export default Item