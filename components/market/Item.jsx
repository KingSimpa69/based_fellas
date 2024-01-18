import styles from "@/styles/market.module.css"
import { useState,useEffect } from "react";
import formatETH from "@/functions/formatETH";

const Item = ({metaType,metaData,price,id}) => {

    const [mouseOn,setMouseOn] = useState(false)
    const [img,setImg] = useState("")

    useEffect(() => {
        if (metaType === "onchain"){
            setImg(metaData.image)
        } 
        if (metaType === "ipfs"){
            setImg(metaData.image.replace('ipfs://', 'https://ipfs.io/ipfs/'))
        }
    }, [metaData,metaType])
    

    return(
        <div onMouseOver={()=>setMouseOn(true)} onMouseOut={()=>setMouseOn(false)} className={styles.itemContainer}>
            <div className={mouseOn?styles.overlay:styles.hidden}>Buy</div>
                <img width={200} height={200} src={img} />
                <p className={styles.itemName}>{metaData.name}</p>
            <div className={styles.horizontalFlex}>
            <p className={styles.itemPrice}>{formatETH(parseFloat(price)/10**18)} ETH</p>
            <p className={styles.itemID}>{id.toString()}</p>
            </div>
        </div>
    )
}

export default Item