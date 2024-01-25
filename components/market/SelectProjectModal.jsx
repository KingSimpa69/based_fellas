import styles from "@/styles/market.module.css"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import ABI from "@/functions/abi.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import delay from "@/functions/delay"
import { shortenEthAddy } from "@/functions/shortenEthAddy"

const SelectContractModal = ({width,chain,modalOpen,setModalOpen,changePage}) => {

    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("hidden")
    const [search,setSearch] = useState("")
    const [result, setResult] = useState([])
    const provider = useEthersSigner()
    const [markets,setMarkets] = useState([])

    const fetchVerified = async () => {
        const marketQuery = await fetch("https://raw.githubusercontent.com/KingSimpa69/markets/main/markets.json")
        const marketList = await marketQuery.json();
        chain.id === 8453 ? setMarkets(marketList[8453]) :
        chain.id === 84532 ? setMarkets(marketList[84532]) : null
    }

    const handleSearch = async (e) => {
        setSearch(e)
        if(ethers.isAddress(e)){
            try {
                const market = new ethers.Contract(e, ABI.market, provider);
                const projectName = await market.projectName()
                const nftContract = await market.nftContract()
                setResult([{
                    projectName: projectName,
                    nftContract: nftContract,
                    marketContract: e
                }])
            } catch (error) {
                setResult([{
                    projectName: "",
                    nftContract: "Invalid market contract address"
                }])
            }

        } else {
            setResult([])
        }
    }

    useEffect(() => {
        chain !== undefined && fetchVerified()
    }, [chain])
    
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
        modalOpen ? openModal() : closeModal()
    }, [modalOpen])

    return(
        <div className={`${css0} ${styles[css1]}`} onClick={()=>setModalOpen(!modalOpen)}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.selectProjectModal}>
                <div className={styles.contractSearchCont}>
                    <input value={search} onChange={(e)=>handleSearch(e.target.value)} type="text" className={styles.searchBar} placeholder="Enter marketplace contract" />
                </div>
                <div className={styles.contractList}>
                    {search === "" && chain ? (markets.map((e,index) => {
                        return (
                            <div key={index} onClick={() => { changePage(`/market/${e.contracts.market}`) }} className={styles.clItem}>
                                <div className={styles.clItemL}>
                                    <h1>{e.name}</h1>
                                    <p>{width < 480 ? shortenEthAddy(e.contracts.nft) : e.contracts.nft}</p>
                                </div>
                                <div className={styles.clItemR}>
                                    <img src={e.image} />
                                </div>
                            </div>
                        )
                    })) : (
                        result.length > 0 ? (
                            result.map((e,index)=>{
                                return(
                                    <div key={index} onClick={() => { result[0].projectName !== "" && changePage(`/market/${e.marketContract}`) }} className={styles.clItem}>
                                        <div className={styles.clItemL}>
                                            <h1>{e.projectName}</h1>
                                            <p>{width < 480 ? shortenEthAddy(e.nftContract) : e.nftContract}</p>
                                        </div>
                                        <div className={styles.clItemR}>
                                            <FontAwesomeIcon icon="fa-solid fa-circle-question" />
                                        </div>
                                    </div>
                                )
                            })
                        ) : null
                    )}
                    <div className={styles.addMarket}>
                        <a target="_blank" href={"https://github.com/KingSimpa69/markets"}><h1>Add Market</h1></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectContractModal