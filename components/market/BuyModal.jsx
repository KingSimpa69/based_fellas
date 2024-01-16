import styles from "@/styles/market.module.css"
import { ethers } from "ethers"
import ABI from "@/functions/abi.json"
import { useEffect, useState } from "react"
import { shortenEthAddy } from "@/functions/shortenEthAddy"
import delay from "@/functions/delay"

const BuyModal = ({alert,reload,marketContract,nftContract,id,buyModal,setBuyModal,metaData,price,provider,listed}) => {


    const [owner,setOwner] = useState("ANON")
    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("")

    const imgURL = metaData !== undefined ? metaData.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : null

    const buy = async (i) => {
        try{
            let txLog = {}
            const market = new ethers.Contract(marketContract, ABI.market, provider);
            const tx = await market.buy(listed[i],{value:price})
            const response = await tx.wait()
            const logs = await provider.provider.getLogs({blockHash:response.blockHash})
            for (const log of logs) {
                log.transactionHash === response.hash && (txLog = market.interface.parseLog(log))
            }
            txLog.name === "Sold" ? alert("success","Purchase successful") :
            txLog.name === "Delisted" ? (alert("error","The item was listed but approval revoked"),alert("info","Your ETH has been returned")) : null
            setBuyModal(!buyModal)
            await delay(450)
            reload()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getOwner = async () => {
            try{
                const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
                const result = await nft.ownerOf(id)
                setOwner(shortenEthAddy(result))
            } catch (error) {
                console.log(error)
            }
        }
        provider && !isNaN(id) && ethers.isAddress(nftContract) && getOwner()
    }, [id])

    useEffect(() => {
        const closeModal = async() => {
            setCss0("animate__animated animate__fadeOut animate__faster")
            await delay(450)
            setCss1("hidden")
        }
        const openModal = async() => {
            setCss0("animate__animated animate__fadeIn animate__faster")
            setCss1("modalWrapper")
        }
        buyModal ? openModal() : closeModal()
    }, [buyModal])

    return(
        <div onClick={()=>setBuyModal(!buyModal)} className={`${css0} ${styles[css1]}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.confirmBuyModal}>
                <h1>Confirm Purchase</h1>
                <div className={styles.confirmModalCenter}>
                    <div className={styles.confirmModalImage}>
                        <img width={150} height={150} src={imgURL} />
                    </div>
                    <div className={styles.confirmModalInfo}>
                        <div className={styles.confirmModalInfoItem}>
                            <p>{owner}</p>
                            <p>Current Owner</p>
                        </div>
                        <div className={styles.confirmModalInfoItem}>
                            <p>{parseFloat(price)/10**18} ETH</p>
                            <p>Listing Price</p>
                        </div>
                    </div>
                </div>
                <div className={styles.modalButtons}>
                    <p onClick={()=>setBuyModal(!buyModal)} className={styles.confirmCancelBtn}>Cancel</p>
                    <p onClick={()=>buy(id)} className={styles.confirmBtn}>Buy</p>
                </div>
            </div>
        </div>
    )
}

export default BuyModal