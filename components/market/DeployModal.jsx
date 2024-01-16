import styles from "@/styles/market.module.css"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import {useState,useEffect} from "react"
import ABI from "@/functions/abi.json"
import BYTECODE from "@/functions/bytecode.json"
import useDebounce from "@/hooks/useDebounce"
import delay from "@/functions/delay"


const DeployModal = ({router,alert,deployModal,setDeployModal}) => {

    const provider = useEthersSigner()
    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("")
    const [projectName,setProjectName] = useState("")
    const [smartContract,setSmartContract] = useState("")
    const [sanityCheck,setSanityCheck] = useState(false)

    const name = useDebounce(projectName, 400);
    const contract = useDebounce(smartContract, 400);

    const deploy = async () => {
        try{
            const contractFactory = new ethers.ContractFactory(ABI.market,BYTECODE.market,provider)
            const deployedContract = await contractFactory.deploy(projectName,smartContract,{value:5000000000000000});
            await deployedContract.waitForDeployment()
            //console.log(deployedContract.target)
            alert("success","Market deployed")
            setDeployModal(!deployModal)
            await delay(450)
            router.push(`/market/${deployedContract.target}`)
        } catch (error) {
            alert("error","error")
            //console.log(error)
        }

    }

    useEffect(()=>{
        if(name !== "" && ethers.isAddress(contract)){
            setSanityCheck(true)
        } else {
            setSanityCheck(false)
        }
    },[name,contract])

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
                <h1>Deploy</h1>
                <div className={styles.adminModalCenter}>
                        <div className={styles.deployModalItem}>
                            <div className={styles.adminInputs}>
                                <input onChange={(e)=>setProjectName(e.target.value)} placeholder="Name" type="text" value={projectName}/>
                            </div>
                            <div className={styles.deployArgument}>
                                NFT Project Name
                            </div>
                        </div>
                        <div className={styles.deployModalItem}>
                            <div className={styles.adminInputs}>
                                <input onChange={(e)=>setSmartContract(e.target.value)} placeholder="Address" type="text" value={smartContract} />
                            </div>
                            <div className={styles.deployArgument}>
                                NFT Smart Contract
                            </div>
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