import styles from "@/styles/market.module.css"
import { ethers, parseEther } from "ethers"
import {useState,useEffect} from "react"
import ABI from "@/functions/abi.json"
import useDebounce from "@/hooks/useDebounce"
import delay from "@/functions/delay"
import REGISTRY from "@/registry.json"


const AdminModal = ({registryInfo, registry,provider,alert,setAdminModal,adminModal,marketContract,nftContract, reload}) => {

    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("")
    const [taxes,setTaxes] = useState(["","",""])
    const [addresses,setaddresses] = useState(["","","",""])
    const [regValues,setRegValues] = useState(["","","","","","",""])
    const [regChecks,setRegChecks] = useState([false,false,false,false,false,false,false])
    const [sanityChecks,setSanityChecks] = useState([false,false,false])

    const percentages = useDebounce(taxes, 400);
    const addys = useDebounce(addresses, 400);

    const modifyRegChecks = (e,index) => {
        setRegChecks(prev => {
            const updated = [...prev];
            updated[index] = e;
            return updated;
          });
    }

    const modifyRegValues = (e,index) => {
        setRegValues(prev => {
            const updated = [...prev];
            updated[index] = e;
            return updated;
          });
    }

    const handleEntry = async (value,target,target2) => {
        if(target === "tax"){
            setTaxes(prev => {
                const updated = [...prev];
                updated[target2] = value;
                return updated;
              });
        }
        if(target === "addy"){
            setaddresses(prev => {
                const updated = [...prev];
                updated[target2] = value;
                return updated;
              });
        }
    };

    const handleRegEntry = async (value, target) => {
        const targets = ["name", "description", "website", "x", "discord", "telegram", "github"];
        const targetIndex = targets.indexOf(target);
        if (targetIndex !== -1) {
            modifyRegValues(value, targetIndex);
            modifyRegChecks(value !== "", targetIndex);
        }
    };

    const tax = async (target,addy,tax) => {
        try{
            const market = new ethers.Contract(marketContract, ABI.market, provider);
            const tx = await market.setTax(target,addy,tax)
            const response = await tx.wait()
            response && alert("success","Tax set")
        } catch (error) {
            alert("error","Error")
            //console.log(error)
        }
    }

    const transferOwnership = async (addy) => {
        try{
            const market = new ethers.Contract(marketContract, ABI.market, provider);
            const tx = await market.transferOwnership(addy)
            const response = await tx.wait()
            response && alert("success","Ownership transfered")
            setAdminModal(!adminModal)
            await delay(450)
            reload()
        } catch (error) {
            alert("error","Error")
            //console.log(error)
        }
    }

    const registryPush = async (key,value) => {
        try{
            const regFucktion = await key === "name" ? "updateName" :
            key === "description" ? "updateDescription" :
            key === "website" ? "updateWebsite" :
            key === "x" ? "updateX" :
            key === "discord" ? "updateDiscord" :
            key === "telegram" ? "updateTelegram" :
            key === "github" ? "updateGithub" :
            null
            const { chainId } = await provider.provider.getNetwork()
            const regContract = REGISTRY[parseInt(await chainId)]
            const reg = new ethers.Contract(regContract, ABI.mreg, provider);
            const regId = await reg.getMarketIdByContract(marketContract)
            const tx = await reg[regFucktion](parseInt(regId),value)
            const response = await tx.wait()
            response && alert("success",`${key} updated!`)
            await delay(450)
            reload()
        } catch (error) {
            console.log(error)
            alert("error","Error")
        }
    }

    const addToRegistry = async () => {
        try{
            const { chainId } = await provider.provider.getNetwork()
            const regContract = REGISTRY[parseInt(await chainId)]
            const reg = new ethers.Contract(regContract, ABI.mreg, provider);
            const regFee = await reg.registryFee()
            const tx = await reg.addMarket(nftContract,marketContract,{value:parseInt(regFee).toString()})
            const response = await tx.wait()
            response && alert("success","Added to the registry!")
            await delay(450)
            reload()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        ethers.isAddress(addys[0]) && percentages[0] !== "" ? setSanityChecks(prev => {const updated = [...prev];updated[0] = true;return updated;}) : setSanityChecks(prev => {const updated = [...prev];updated[0] = false;return updated;})
        ethers.isAddress(addys[1]) && percentages[1] !== "" ? setSanityChecks(prev => {const updated = [...prev];updated[1] = true;return updated;}) : setSanityChecks(prev => {const updated = [...prev];updated[1] = false;return updated;})
        ethers.isAddress(addys[2]) && percentages[1] !== "" ? setSanityChecks(prev => {const updated = [...prev];updated[2] = true;return updated;}) : setSanityChecks(prev => {const updated = [...prev];updated[2] = false;return updated;})
        ethers.isAddress(addys[3]) ? setSanityChecks(prev => {const updated = [...prev];updated[3] = true;return updated;}) : setSanityChecks(prev => {const updated = [...prev];updated[3] = false;return updated;})
    }, [percentages,addys])
    
    
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
        adminModal ? openModal() : closeModal()
    }, [adminModal])

    useEffect(() => {
        const test = async () => {
            const result = await fetch("https://base-sepolia.blockscout.com/api/v2/tokens/0x91164C6e24CCbDFB82141Ca9EeC4EDaaE22d2114/instances?holder_address_hash=0x93A521A4c6880B290CAb43d192C35058634B00Fc")
            const formatted = await result.json();
            console.log(formatted.items)
        }
        test()
    }, [registryInfo])
    
    
    return(
        <div onClick={()=>setAdminModal(!adminModal)} className={`${css0} ${styles[css1]}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.confirmBuyModal}>
                <h1>Admin</h1>
                <div className={styles.adminModalCenter} style={{height:"420px"}}>
                        <div className={!registry ? styles.registryOnboardCont : styles.hidden}>
                            <div className={styles.registryOnboardText}>Want to have your market indexed by our search bar?<br/> Want to add a custom name, description and project links to your market?<br /> Add your market to our on-chain registry!</div>
                            <div onClick={()=>{addToRegistry()}} className={styles.registryOnboardButton}>ADD TO REGISTRY</div>
                            <div className={styles.registryPriceDisclaim}>Registration costs 0.01 ETH</div>
                        </div>
                        {registry &&<>
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminInputs}>
                            <p>Name:</p>
                                <input onChange={(e)=>handleRegEntry(e.target.value,"name")} placeholder={registryInfo[2] !== "" ? registryInfo[2] : "Based Fellas"} type="text" value={regValues[0]}/>
                            </div>
                            <p onClick={()=>{regChecks[0] ? registryPush("name",regValues[0]) : null}} className={regChecks[0] ? styles.confirmBtn : styles.notApprovedBtn}>Update</p>
                        </div> 
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminInputs}>
                            <p>Description:</p>
                                <input onChange={(e)=>handleRegEntry(e.target.value,"description")} placeholder={registryInfo[3] !== "" ? registryInfo[3] : "Brief project description"} type="text" value={regValues[1]}/>
                            </div>
                            <p onClick={()=>{regChecks[1] ? registryPush("description",regValues[1]) : null}} className={regChecks[1] ? styles.confirmBtn : styles.notApprovedBtn}>Update</p>
                        </div>
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminInputs}>
                            <p>Website:</p>
                                <input onChange={(e)=>handleRegEntry(e.target.value,"website")} placeholder={registryInfo[4] !== "" ? registryInfo[4] : "https://basedfellas.io"} type="text" value={regValues[2]}/>
                            </div>
                            <p onClick={()=>{regChecks[2] ? registryPush("website",regValues[2]) : null}} className={regChecks[2] ? styles.confirmBtn : styles.notApprovedBtn}>Update</p>
                        </div>
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminInputs}>
                            <p>X:</p>
                                <input onChange={(e)=>handleRegEntry(e.target.value,"x")} placeholder={registryInfo[5] !== "" ? registryInfo[5] : "https://x.com/KingSimpa69"} type="text" value={regValues[3]}/>
                            </div>
                            <p onClick={()=>{regChecks[3] ? registryPush("x",regValues[3]) : null}} className={regChecks[3] ? styles.confirmBtn : styles.notApprovedBtn}>Update</p>
                        </div> 
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminInputs}>
                            <p>Discord:</p>
                                <input onChange={(e)=>handleRegEntry(e.target.value,"discord")} placeholder={registryInfo[6] !== "" ? registryInfo[6] : "https://discord.com/invite/EVk2Zk2N3z"} type="text" value={regValues[4]}/>
                            </div>
                            <p onClick={()=>{regChecks[4] ? registryPush("discord",regValues[4]) : null}} className={regChecks[4] ? styles.confirmBtn : styles.notApprovedBtn}>Update</p>
                        </div> 
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminInputs}>
                            <p>Telegram:</p>
                                <input onChange={(e)=>handleRegEntry(e.target.value,"telegram")} placeholder={registryInfo[7] !== "" ? registryInfo[7] : "https://t.me/yourTeleLink"} type="text" value={regValues[5]}/>
                            </div>
                            <p onClick={()=>{regChecks[5] ? registryPush("telegram",regValues[5]) : null}} className={regChecks[5] ? styles.confirmBtn : styles.notApprovedBtn}>Update</p>
                        </div> 
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminInputs}>
                            <p>Github:</p>
                                <input onChange={(e)=>handleRegEntry(e.target.value,"github")} placeholder={registryInfo[8] !== "" ? registryInfo[8] : "https://github.com/KingSimpa69"} type="text" value={regValues[6]}/>
                            </div>
                            <p onClick={()=>{regChecks[6] ? registryPush("github",regValues[6]) : null}} className={regChecks[6] ? styles.confirmBtn : styles.notApprovedBtn}>Update</p>
                        </div> 
                        </>}
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminFunction}>
                                Tax 1
                            </div>
                            <div className={styles.adminInputs}>
                                <input onChange={(e)=>handleEntry(e.target.value,"addy",0)} placeholder="Address" type="text" value={addresses[0]}/>
                                <input onChange={(e)=>handleEntry(e.target.value,"tax",0)} placeholder="Tax %" type="text" value={taxes[0]}/>
                            </div>
                            <p onClick={()=>{sanityChecks[0] ? tax(0,addresses[0],taxes[0]) : null}} className={sanityChecks[0] ? styles.confirmBtn : styles.notApprovedBtn}>Set Tax</p>
                        </div>
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminFunction}>
                                Tax 2
                            </div>
                            <div className={styles.adminInputs}>
                                <input onChange={(e)=>handleEntry(e.target.value,"addy",1)} placeholder="Address" type="text" value={addresses[1]}/>
                                <input onChange={(e)=>handleEntry(e.target.value,"tax",1)}  placeholder="Tax %" type="text" value={taxes[1]}/>
                            </div>
                            <p onClick={()=>{sanityChecks[1] ? tax(1,addresses[1],taxes[1]) : null}} className={sanityChecks[1]? styles.confirmBtn : styles.notApprovedBtn}>Set Tax</p>
                        </div>
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminFunction}>
                                Tax 3
                            </div>
                            <div className={styles.adminInputs}>
                                <input onChange={(e)=>handleEntry(e.target.value,"addy",2)} placeholder="Address" type="text" value={addresses[2]}/>
                                <input onChange={(e)=>handleEntry(e.target.value,"tax",2)}  placeholder="Tax %" type="text" value={taxes[2]}/>
                            </div>
                            <p onClick={()=>{sanityChecks[2] && tax(2,addresses[2],taxes[2])}} className={sanityChecks[2] ? styles.confirmBtn : styles.notApprovedBtn}>Set Tax</p>
                        </div>
                        <div className={styles.adminModalItem}>
                            <div className={styles.adminFunction}>
                                New Owner
                            </div>
                            <div className={styles.adminInputs}>
                                <input onChange={(e)=>handleEntry(e.target.value,"addy",3)} placeholder="Address" type="text" value={addresses[3]}/>
                            </div>
                            <p onClick={()=>{sanityChecks[3] && transferOwnership(addresses[3])}} className={sanityChecks[3] ? styles.confirmBtn : styles.notApprovedBtn}>Set</p>
                        </div>
                </div>
                <div className={styles.adminModalExit}>
                    <div onClick={()=>setAdminModal(!adminModal)} className={styles.adminExitButton}>Exit</div>
                </div>
            </div>
        </div>
    )
}

export default AdminModal