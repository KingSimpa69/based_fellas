import styles from "@/styles/market.module.css"
import { ethers } from "ethers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {useState,useEffect} from "react"
import ABI from "@/functions/abi.json"
import useDebounce from "@/hooks/useDebounce"
import { parseEther } from "ethers"
import Spinner1 from "../Spinner1"
import { Address } from "viem"
import delay from "@/functions/delay"


const ListingModal = ({id, setId, metaType,alert,reload,setListingModal,listingModal,provider,nftContract,marketContract}) => {

    // status[0]Exists status[1]owned status[2]Approved
    const [status,setStatus] = useState([])
    const [price,setPrice] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("hidden")
    const [image,setImage] = useState(<FontAwesomeIcon icon="fa-regular fa-image" />)

    const debouncedID = useDebounce(id, 400);

    const handleEntry = async () => {
        setImage(<Spinner1 />);
        try {
            const nft = new ethers.Contract(nftContract, ABI.fellas, provider);

            let statusArray = [false, false, false];
            let img = ""
    
            if (!ethers.isAddress(nftContract)) {
                throw new Error('Invalid contract address');
            }

            const tokenURI = await nft.tokenURI(parseInt(id));
    
            if (tokenURI) {
                statusArray = [true, false, false];
            }

            if(metaType === "ipfs"){
                const ipfsGateway = 'https://ipfs.io/ipfs/';
                const baseUri = await nft.tokenURI(id);
                const metaURL = ipfsGateway + baseUri.replace('ipfs://', '');
                const metaResp = await fetch(metaURL);
                const metaData = await metaResp.json();
                const imgURL = metaData?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || metaData?.image;
                img = imgURL
            }

            if(metaType === "http"){
                const baseUri = await nft.tokenURI(id);
                const metaResp = await fetch(baseUri);
                const metaData = await metaResp.json();
                const imgURL = metaData.image.startsWith("ipfs://") ? metaData.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : metaData?.image;
                img = imgURL
            }

            if(metaType === "onchain"){
                const metaString = await nft.tokenURI(parseInt(id))
                const jsonString = atob(metaString.split(',')[1]);
                const metaData = JSON.parse(jsonString);
                img = metaData.image
            }

            const owner = await nft.ownerOf(parseInt(id));
    
            if (owner.toString().toLowerCase() === provider.address.toString().toLowerCase()) {
                statusArray = [true, true, false];
            }
    
            const approved = await nft.getApproved(id);
    
            if (approved.toString().toLowerCase() === marketContract.toString().toLowerCase()) {
                statusArray = [true, true, true];
            }

                setImage(<img width={150} src={img} />);
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

    const list = async () => {
        try{
            let txLog = {}
            const market = new ethers.Contract(marketContract, ABI.market, provider);
            const tx = await market.list(id,parseEther(price))
            const response = await tx.wait()
            const logs = await provider.provider.getLogs({blockHash:response.blockHash})
            for (const log of logs) {
                log.transactionHash === response.hash && (txLog = market.interface.parseLog(log))
            }
            txLog.name === "Listed" && alert("success","Listing successful")
            setListingModal(!listingModal)
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
        mounted && !isNaN(debouncedID) && ethers.isAddress(nftContract) && handleEntry()
        return()=>{mounted.false}
    }, [debouncedID])

    useEffect(()=>{
        price > parseFloat(0) && price !== null ? setStatus([true,true,true,true]) : setStatus([true,true,true,false])
    },[price])

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
        listingModal ? openModal() : closeModal()
    }, [listingModal])
    
    return(
        <div onClick={()=>setListingModal(!listingModal)} className={`${css0} ${styles[css1]}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.confirmBuyModal}>
                <h1>List</h1>
                <div className={styles.confirmModalCenter}>
                    <div className={styles.confirmModalImage}>
                    {image}
                    </div>
                    <div className={styles.confirmModalInfo}>
                        <div className={styles.confirmModalInfoItem}>
                            <input onChange={(e)=>setId(e.target.value)} type="text" placeholder={"id"} value={id}/>
                        </div>
                        <div className={styles.confirmModalInfoItem}>
                            {status[0] && status[1] && status[2] && <><input onChange={(e) => setPrice(e.target.value)} type="text" placeholder={"Price"} value={price} /><div className={styles.ethGrey}>ETH</div></>}
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
                    <p onClick={()=>setListingModal(!listingModal)} className={styles.confirmCancelBtn}>Cancel</p>
                    <p onClick={()=>status[3]&&list()} className={status[3] ? styles.confirmBtn : styles.notApprovedBtn}>List</p>
                </div>
            </div>
        </div>
    )
}

export default ListingModal