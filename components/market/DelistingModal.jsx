import styles from "@/styles/market.module.css"
import { ethers } from "ethers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {useState,useEffect} from "react"
import ABI from "@/functions/abi.json"
import useDebounce from "@/hooks/useDebounce"
import { parseEther } from "ethers"
import Spinner1 from "../Spinner1"
import delay from "@/functions/delay"

const DelistingModal = ({alert,reload,setDelistingModal,delistingModal,provider,nftContract,marketContract}) => {

    // status[0]Exists status[1]Listed status[2]Owned status[3]Approved
    const [status,setStatus] = useState([])

    const [id,setId] = useState("")
    const [price,setPrice] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("")
    const [image,setImage] =  useState(<FontAwesomeIcon icon="fa-regular fa-image" />)

    const debouncedID = useDebounce(id, 400);

    const handleEntry = async () => {
        setImage(<Spinner1 />);
        if(!isNaN(id)){
            try {
                let statusArray = [false, false, false, false];
        
                if (!ethers.isAddress(nftContract)) {
                    throw new Error('Invalid contract address');
                }
        
                const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
                const market = new ethers.Contract(marketContract, ABI.market, provider);
                const tokenURI = await nft.tokenURI(parseInt(id));
        
                if (tokenURI) {
                    statusArray = [true, false, false, false];
                } else {
                    setStatus(statusArray);
                    return;
                }
    
                const listedTokens = await market.getListedTokens()
    
                if (listedTokens.includes(BigInt(id))) {
                    statusArray = [true, true, false, false];
                } else {
                    setStatus(statusArray);
                    return;
                }
        
                const ipfsGateway = 'https://ipfs.io/ipfs/';
                const baseUri = await nft.baseURI();
                const metaURL = ipfsGateway + baseUri.replace('ipfs://', '');
                const metaResp = await fetch(`${metaURL}${id}`);
                const metaData = await metaResp.json();
                const imgURL = metaData?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || null;
                const owner = await nft.ownerOf(parseInt(id));

                setImage(<img width={150} src={imgURL} />);
        
                if (owner === provider.address) {
                    statusArray = [true, true, true, false];
                } else {
                    setStatus(statusArray);
                    return;
                }
        
                const approved = await nft.getApproved(id);
        
                if (approved === marketContract) {
                    statusArray = [true, true, true, true];
                } else {
                    setStatus(statusArray);
                    return;
                }
                    setStatus(statusArray);
            } catch (error) {
                setStatus([false,false,false,false])
                //console.log(error)
            }
        } else {
            setStatus([false, false, false, false])
        }

    };

    const revoke = async () => {
        try{
            let txLog = {}
            const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
            const tx = await nft.approve("0x0000000000000000000000000000000000000000",id)
            const response = await tx.wait()
            const logs = await provider.provider.getLogs({blockHash:response.blockHash})
            for (const log of logs) {
                log.transactionHash === response.hash && (txLog = nft.interface.parseLog(log))
            }
            txLog.name === "Approval" && alert("success","Approval revoked")
            await handleEntry()
        } catch (error) {
            console.log(error)
        }
    }

    const delist = async () => {
        try{
            let txLog = {}
            const market = new ethers.Contract(marketContract, ABI.market, provider);
            const tx = await market.delist(id)
            const response = await tx.wait()
            const logs = await provider.provider.getLogs({blockHash:response.blockHash})
            for (const log of logs) {
                log.transactionHash === response.hash && (txLog = market.interface.parseLog(log))
            }
            txLog.name === "Delisted" && alert("success","Delisting successful")
            setDelistingModal(!delistingModal)
            await delay(450)
            setPrice("")
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
            setErrorMessage("Item is not listed");
            return;
        }
        if (!status[2]) {
            setErrorMessage("You do not own this item");
            return;
        }
        if (status[3]) {
            setErrorMessage("Revoke approval before delisting");
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
        delistingModal ? openModal() : closeModal()
    }, [delistingModal])
    
    return(
        <div onClick={()=>setDelistingModal(!delistingModal)} className={`${css0} ${styles[css1]}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.confirmBuyModal}>
                <h1>Delist</h1>
                <div className={styles.confirmModalCenter}>
                    <div className={styles.confirmModalImage}>
                    {image}
                    </div>
                    <div className={styles.confirmModalInfo}>
                        <div className={styles.confirmModalInfoItem}>
                            <input onChange={(e)=>setId(e.target.value)} type="text" placeholder={"id"} value={id}/>
                        </div>
                        <div className={status[1] && status[2] && status[3] ? styles.confirmModalInfoItem : styles.hidden}>
                            <p onClick={()=>revoke()} className={styles.approveButton}>Revoke Approval</p>
                        </div>
                        <div className={errorMessage ? styles.confirmModalInfoItem : styles.hidden}>
                            <div className={styles.listErrorText}>{errorMessage}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.modalButtons}>
                    <p onClick={()=>setDelistingModal(!delistingModal)} className={styles.confirmCancelBtn}>Cancel</p>
                    <p onClick={()=>!status[3]&&delist()} className={!status[3] && status[2] ? styles.confirmBtn : styles.notApprovedBtn}>Delist</p>
                </div>
            </div>
        </div>
    )
}

export default DelistingModal