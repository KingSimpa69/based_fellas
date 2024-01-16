import styles from "@/styles/market.module.css"
import { useEffect, useState } from "react"
import markets from "@/markets.json"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import { useNetwork } from 'wagmi'
import ABI from "@/functions/abi.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SelectContractModal = ({chain,modalOpen,setModalOpen,changePage}) => {

    const [css1,setCss1] = useState("hidden")
    const [search,setSearch] = useState("")
    const [result, setResult] = useState([])
    const provider = useEthersSigner()

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

    useEffect(()=>{
        modalOpen ? setCss1("modalWrapper") : setCss1("hidden")
    },[modalOpen])

    return(
        <div className={styles[css1]} onClick={()=>setModalOpen(!modalOpen)}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.selectProjectModal}>
                <div className={styles.contractSearchCont}>
                    <input value={search} onChange={(e)=>handleSearch(e.target.value)} type="text" className={styles.searchBar} placeholder="Enter marketplace contract" />
                </div>
                <div className={styles.contractList}>
                    {search === "" && chain && chain.id === 8453 ? (markets.map((e,index) => {
                        return (
                            <div key={index} onClick={() => { changePage(`/market/${e.contracts.market}`) }} className={styles.clItem}>
                                <div className={styles.clItemL}>
                                    <h1>{e.name}</h1>
                                    <p>{e.contracts.nft}</p>
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
                                            <p>{e.nftContract}</p>
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
                        <h1>Add Market</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectContractModal