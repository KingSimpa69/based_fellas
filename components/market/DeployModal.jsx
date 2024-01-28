import styles from "@/styles/market.module.css"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import {useState,useEffect} from "react"
import ABI from "@/functions/abi.json"
import BYTECODE from "@/functions/bytecode.json"
import useDebounce from "@/hooks/useDebounce"
import delay from "@/functions/delay"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const DeployModal = ({router,alert,deployModal,setDeployModal,setWriting}) => {

    const provider = useEthersSigner()
    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("hidden")
    const [projectName,setProjectName] = useState("")
    const [smartContract,setSmartContract] = useState("")
    const [sanityCheck,setSanityCheck] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")

    const contract = useDebounce(smartContract, 400);

    const deploy = async () => {
        try{
            const contractFactory = new ethers.ContractFactory(ABI.market,BYTECODE.market,provider)
            setWriting(true)
            const deployedContract = await contractFactory.deploy(projectName,smartContract,{value:5000000000000000});
            await deployedContract.waitForDeployment()
            alert("success","Market deployed")
            setDeployModal(!deployModal)
            setWriting(false)
            await delay(450)
            router.push(`/market/${deployedContract.target}`)
        } catch (error) {
            setWriting(false)
            alert("error","error")
            //console.log(error)
        }
    }

    useEffect(()=>{
        const getInfo = async () => {
            try{
                const nft = new ethers.Contract(contract.toString().toLowerCase(), ABI.erc721, provider);
                // Check if metadata string is valid (Thanks Vesper!)
                try {
                    console.log(contract)
                    const validURI = await nft.tokenURI(1);
                    console.log(validURI)
                    if (validURI === "") {
                      setErrorMessage("Invalid metadata for this contract!");
                      return;
                    }
                } catch (error) {
                    console.log(error)
                  setErrorMessage("Invalid metadata for this contract!");
                  return;
                }
                setProjectName(await nft.name())
                setErrorMessage("")
                setSanityCheck(true)
            } catch (error) {
                setErrorMessage("Not a valid NFT contract")
                console.log(error)
            }
        }
        if(contract === ""){
            setErrorMessage("")
        }
        else if(ethers.isAddress(contract)){
            getInfo()
        } else {
            setErrorMessage("Not a valid ETH address")
            setProjectName("")
            setSanityCheck(false)
        }
    },[contract])

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
        deployModal ? openModal() : closeModal()
    }, [deployModal])
    
    return(
        <div onClick={()=>setDeployModal(!deployModal)} className={`${css0} ${styles[css1]}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.confirmBuyModal}>
                <h1>Deploy Market</h1>
                <div className={styles.adminModalCenter}>
                        <div className={styles.deployModalItem}>
                            <div className={styles.deployProjectName}>{projectName}</div>
                            <div className={styles.pasteInputContainer}>
                              <div>
                              <input onChange={(e)=>setSmartContract(e.target.value)} placeholder="Address" type="text" value={smartContract} />
                              </div>
                            {/*<div onClick={()=>handlePaste()} className={styles.pasteButton}>
                                <FontAwesomeIcon icon="fa-regular fa-paste" />
                            </div>*/}
                            </div>
                            <div className={styles.deployArgument}>
                                NFT Smart Contract
                            </div>
                            <div className={errorMessage ? styles.confirmModalInfoItem : styles.hidden}>
                            <div className={styles.listErrorText}>{errorMessage}</div>
                        </div>
                            <div className={styles.lpBsMsg}>0.005 ETH Required to bootstrap LP</div>
                        </div>
                </div>
                <div className={styles.modalButtons}>
                    <p onClick={()=>setDeployModal(!deployModal)} className={styles.confirmCancelBtn}>Cancel</p>
                    <p onClick={()=>sanityCheck && deploy()} className={sanityCheck ? styles.confirmBtn : styles.notApprovedBtn}>Deploy</p>
                </div>
            </div>
        </div>
    )
}

export default DeployModal