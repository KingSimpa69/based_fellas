import styles from "@/styles/market.module.css"
import { ethers } from "ethers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {useState,useEffect} from "react"
import ABI from "@/functions/abi.json"
import useDebounce from "@/hooks/useDebounce"
import formatETH from "@/functions/formatETH"
import Spinner1 from "../Spinner1"
import delay from "@/functions/delay"


const LiquidateModal = ({alert,reload,setLiquidateModal,liquidateModal,provider,nftContract,marketContract}) => {

    // status[0]Exists status[1]owned status[2]Approved
    const [status,setStatus] = useState([])

    const [id,setId] = useState("")
    const [liquidationPrice,setLiquidationPrice] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("")
    const [image,setImage] =  useState(<FontAwesomeIcon icon="fa-regular fa-image" />)

    const debouncedID = useDebounce(id, 400);

    const handleEntry = async () => {
        setImage(<Spinner1 />);
        try {
            let statusArray = [false, false, false];
    
            if (!ethers.isAddress(nftContract)) {
                throw new Error('Invalid contract address');
            }
    
            const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
            const market = new ethers.Contract(marketContract, ABI.market, provider);
            const tokenURI = await nft.tokenURI(parseInt(id));
    
            if (tokenURI) {
                statusArray = [true, false, false];
            }
    
            const ipfsGateway = 'https://ipfs.io/ipfs/';
            const baseUri = await nft.baseURI();
            const metaURL = ipfsGateway + baseUri.replace('ipfs://', '');
            const metaResp = await fetch(`${metaURL}${id}`);
            const metaData = await metaResp.json();
            const imgURL = metaData?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || null;
            const owner = await nft.ownerOf(parseInt(id));
            const liquidationPrice = await market.itemValue();

            setLiquidationPrice(parseFloat(liquidationPrice)/10**18)
    
            if (owner === provider.address) {
                statusArray = [true, true, false];
            }
    
            const approved = await nft.getApproved(id);
    
            if (approved === marketContract) {
                statusArray = [true, true, true];
            }

                setImage(<img width={150} src={imgURL} />);
                setStatus(statusArray);

        } catch (error) {
            //console.log(error);
        }
    };

    const approve = async () => {
        try{
            let txLog = {}
            const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
            const tx = await nft.approve(marketContract,id)
            const response = await tx.wait()
            const logs = await provider.provider.getLogs({blockHash:response.blockHash})
            for (const log of logs) {
                log.transactionHash === response.hash && (txLog = nft.interface.parseLog(log))
            }
            txLog.name === "Approval" && alert("success","Approval successful")
            await handleEntry()
        } catch (error) {
            console.log(error)
        }
    }

    const liquidate = async () => {
        try{
            let txLog = {}
            const market = new ethers.Contract(marketContract, ABI.market, provider);
            const tx = await market.liquidate(id)
            const response = await tx.wait()
            const logs = await provider.provider.getLogs({blockHash:response.blockHash})
            for (const log of logs) {
                log.transactionHash === response.hash && (txLog = market.interface.parseLog(log))
            }
            txLog.name === "Listed" && alert("success","Liquidation successful")
            setLiquidateModal(!liquidateModal)
            await delay(450)
            setLiquidationPrice("")
            setId("")
            setStatus([false,false,false,false])
            reload();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        let mounted = true
        mounted && !isNaN(debouncedID) && handleEntry()
        return()=>{mounted.false}
    }, [debouncedID])

    useEffect(() => {
        setStatus([false,false,false,false])
    }, [])

    useEffect(() => {
        if (!status[0]) {
            setErrorMessage("Enter a valid ID");
            return;
        }
        if (!status[1]) {
            setErrorMessage("You do not own the following item");
            return;
        }
        if (!status[2]) {
            setErrorMessage("Item is not approved");
            return;
        }
        setErrorMessage(null);
    }, [status]);

    
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
        liquidateModal ? openModal() : closeModal()
    }, [liquidateModal])
    
    return(
        <div onClick={()=>setLiquidateModal(!liquidateModal)} className={`${css0} ${styles[css1]}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.confirmBuyModal}>
                <h1>Liquidate</h1>
                <div className={styles.confirmModalCenter}>
                    <div className={styles.confirmModalImage}>
                    {image}
                    </div>
                    <div className={styles.confirmModalInfo}>
                        <div className={styles.confirmModalInfoItem}>
                            <input onChange={(e)=>setId(e.target.value)} type="text" placeholder={"id"} value={id}/>
                        </div>
                        <div className={styles.confirmModalInfoItem}>
                            {status[0] && status[1] && status[2] && <>
                            <div className={styles.liquidationMsg}>Liquidate token #{id}<br/>for<br/>{formatETH(liquidationPrice)} ETH</div>
                            <div className={styles.liquidateFormula}>lpEthBalance / (nftTotalSupply - nftsHeldByLp)</div>
                            </>}
                        </div>
                        <div className={status[1] && !status[2] ? styles.confirmModalInfoItem : styles.hidden}>
                            <p onClick={()=>approve()} className={styles.approveButton}>Approve</p>
                        </div>
                        <div className={errorMessage ? styles.confirmModalInfoItem : styles.hidden}>
                            <div className={styles.listErrorText}>{errorMessage}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.modalButtons}>
                    <p onClick={()=>setLiquidateModal(!liquidateModal)} className={styles.confirmCancelBtn}>Cancel</p>
                    <p onClick={()=>status[2]&&liquidate()} className={status[2] ? styles.confirmBtn : styles.notApprovedBtn}>Liquidate</p>
                </div>
            </div>
        </div>
    )
}

export default LiquidateModal