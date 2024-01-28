import styles from "@/styles/market.module.css"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import ABI from "@/functions/abi.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import delay from "@/functions/delay"
import { shortenEthAddy } from "@/functions/shortenEthAddy"
import REGISTRY from "@/registry.json"
import formatETH from "@/functions/formatETH"
import Loading from "./Loading"

const SelectContractModal = ({width,chain,modalOpen,setModalOpen,changePage}) => {

    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("hidden")
    const [search,setSearch] = useState("")
    const [result, setResult] = useState([])
    const provider = useEthersSigner()
    const [markets,setMarkets] = useState([])
    const [loading,setLoading] = useState(false)

    const fetchVerified = async () => {
        const marketQuery = await fetch("https://raw.githubusercontent.com/KingSimpa69/markets/main/markets.json")
        const marketList = await marketQuery.json();
        chain.id === 8453 ? setMarkets(marketList[8453]) :
        chain.id === 84532 ? setMarkets(marketList[84532]) : null
    }

    function checkIfVerified(market) {
        return markets.find(e => e.contracts.market === market);
    }

    const handleSearch = async (e) => {
        setSearch(e)
        if(ethers.isAddress(e)){
            setLoading(true)
            try{
                const { chainId } = await provider.provider.getNetwork();
                const regContract = REGISTRY[parseInt(chainId)];
                const registry = new ethers.Contract(regContract, ABI.mreg, provider);
                const marketList = await registry.getMarkets(e.toString().toLowerCase());
                const marketDataPromises = marketList.map(async (marketId) => {
                    const marketData = await registry.marketData(parseInt(marketId));
                    const marketContract = new ethers.Contract(marketData[1], ABI.market, provider);
                    const projectName = await marketContract.projectName();
                    const volume = await marketContract.volume();
                    return {
                        projectName: marketData[2] === "" ? projectName : marketData[2],
                        nftContract: e,
                        marketContract: marketData[1],
                        volume: parseInt(volume)
                    };
                });
                const marketDataArray = await Promise.all(marketDataPromises);
                marketDataArray.sort((a, b) => b.volume - a.volume);
                setResult(marketDataArray.length > 0 ? marketDataArray : [{ projectName: "ERROR", marketContract: "No markets found", volume: "No markets found"}]);
                setLoading(false)
            } catch (error) {
                setResult([{
                    projectName: "",
                    nftContract: "Invalid market contract address"
                }])
                setLoading(false)
                console.log(error)
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
                    <input value={search} onChange={(e)=>handleSearch(e.target.value)} type="text" className={styles.searchBar} placeholder="Search NFT contract" />
                </div>
                <div className={styles.contractList}>
                    {loading && <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"25px",marginBottom:"25px"}}><Loading /></div>}
                    {search === "" && chain ? (markets.map((e,index) => {
                        return (
                            <div key={index} onClick={() => {changePage(`/market/${e.contracts.market}`) }} className={styles.clItem}>
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
                                    <div key={index} onClick={() => { e.projectName !== "" && e.marketContract !== "No markets found" && changePage(`/market/${e.marketContract}`) }} className={styles.clItem}>
                                        <div className={styles.clItemL}>
                                            <h1 className={styles.projectName}>{e.projectName}  {checkIfVerified(e.marketContract) ? <div className={styles.verified}>VERIFIED</div> : null}</h1>
                                            {e.volume !== "" && e.volume !== "No markets found" && <div className={styles.volumeInList}>Volume: <div className={styles.volumeInListValue}>{formatETH(parseFloat(e.volume)/10**18)} ETH</div></div>}
                                            <p>{width < 480 ? shortenEthAddy(e.nftContract) : e.marketContract}</p>
                                        </div>
                                        <div className={styles.clItemR}>
                                            {checkIfVerified(e.marketContract) ? <img src={checkIfVerified(e.marketContract).image} /> :<FontAwesomeIcon icon="fa-solid fa-circle-question" />}
                                        </div>
                                    </div>
                                )
                            })
                        ) : null
                    )}
                </div>
                <div className={styles.addMarket}>
                        <a target="_blank" href={"https://github.com/KingSimpa69/markets"}><h1>Verify A Market</h1></a>
                    </div>
            </div>
        </div>
    )
}

export default SelectContractModal