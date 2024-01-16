import styles from "@/styles/market.module.css"
import { ethers } from "ethers"
import {useState,useEffect} from "react"
import ABI from "@/functions/abi.json"
import useDebounce from "@/hooks/useDebounce"
import delay from "@/functions/delay"


const AdminModal = ({provider,alert,setAdminModal,adminModal,marketContract}) => {

    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("")
    const [taxes,setTaxes] = useState(["","",""])
    const [addresses,setaddresses] = useState(["","","",""])
    const [sanityChecks,setSanityChecks] = useState([false,false,false])

    const percentages = useDebounce(taxes, 400);
    const addys = useDebounce(addresses, 400);

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
    
    return(
        <div onClick={()=>setAdminModal(!adminModal)} className={`${css0} ${styles[css1]}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.confirmBuyModal}>
                <h1>Admin</h1>
                <div className={styles.adminModalCenter}>
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