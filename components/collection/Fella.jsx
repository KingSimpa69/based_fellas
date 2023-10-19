import Image from "next/image"
import styles from "../../styles/collection.module.css"

const Fella = ({nft}) => {


    return(
    <div className={`${styles.fella} animate__animated animate__fadeIn`}>
    <div className={styles.fellaoverlay}><h1>{nft._id}</h1></div>
      <Image
        src={`/images/fellas/${nft._id}.png`}
        fill={true}
        alt={nft._id}
        unoptimized
      />
    </div>
    )
}

export default Fella