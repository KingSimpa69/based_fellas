import styles from "@/styles/market.module.css"
import HorizontalRule from "@/components/HorizontalRule"
import Listings from "@/components/market/Listings"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import ABI from "@/functions/abi.json"
import REGISTRY from "@/registry.json"
import Loading from "@/components/market/Loading"
import delay from "@/functions/delay"
import StatBox from "@/components/market/StatBox"
import { useWindowSize } from "@/hooks/useWindowSize"
import { shortenEthAddy } from "@/functions/shortenEthAddy"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"



const Market = ({goodToTx,alert}) => {

    const [owned,setOwned] = useState([])
    const [stats,setStats] = useState({})
    const [marketContract,setMarketContract] = useState("")
    const [nftContract, setNftContract] = useState("")
    const [registry,setRegistry] = useState(false)
    const [registryInfo,setRegistryInfo] = useState(["","","","","","","","",""])
    const [projectName,setProjectName] = useState("Market")
    const [loading,setIsLoading] = useState(true)
    const [isValid,setIsValid] = useState(false)
    const [showWallet,setShowWallet] = useState(false)
    const [errormsg,setErrormsg] = useState("")
    const route = useRouter();
    const provider = useEthersSigner()
    const {width} = useWindowSize();

    const stopLoading = async () => {
        await delay(1500)
        setIsLoading(false)
    }

    const reload = async () => {
        setIsValid(false)
        setIsLoading(true)
        await checkMarket(route.query.market[0], provider)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText("basedfellas.io/market/"+marketContract);
        alert("success","Copied!")
    }

    const checkMarket = async (marketAddress, currentProvider) => {
        if(!goodToTx.connected || !goodToTx.network){route.push('/market')}
        try {
            const market = new ethers.Contract(marketAddress.toString(), ABI.market, currentProvider);
            const projectName = await market.projectName();
            const nftContract = await market.nftContract();
            if (projectName && nftContract) {
                try{
                    const { chainId } = await currentProvider.provider.getNetwork()
                    const regContract = REGISTRY[parseInt(await chainId)]
                    const registry = new ethers.Contract(regContract, ABI.mreg, currentProvider);
                    const marketid = await registry.getMarketIdByContract(marketAddress)
                    const marketData = await registry.getMarketData(parseInt(marketid))
                    if (parseInt(marketData[0]) !== 0) {
                        setRegistryInfo(marketData)
                        setRegistry(true)
                        setMarketContract(marketAddress)
                        setNftContract(nftContract)
                        setProjectName(marketData[2]+ " Market")
                        setIsValid(true)
                        return
                    } else {
                        setRegistry(false)
                        console.log("No market match in registry!")
                    }
                } catch (error) {
                    setRegistry(false)
                    console.log(error)
                }
                setMarketContract(marketAddress);
                setNftContract(nftContract);
                setProjectName(projectName + " Market");
                setIsValid(true)
            }
        } catch (error) {
            setErrormsg("Error loading market contract")
            setIsValid(false);
            stopLoading()
        }
    };
    
    useEffect(() => {
        const fetchMarket = async () => {
            if (provider !== undefined && goodToTx && route.query.market) {
                const currentProvider = provider;
                ethers.isAddress(route.query.market[0]) ? await checkMarket(route.query.market[0], currentProvider) : stopLoading()
            } else if (provider === undefined) {
                setErrormsg("Please connect a wallet")
                stopLoading()
            }
        };
        setIsLoading(true)
        provider !== undefined && fetchMarket();
    }, [provider]);

    useEffect(() => {
        const pullOwned = async () => {
            try {
                let uniqueToken = null;
                let owned = [];
                do {
                    const result = await fetch(`https://base-sepolia.blockscout.com/api/v2/tokens/${nftContract}/instances?holder_address_hash=${provider.address}${uniqueToken ? `&unique_token=${uniqueToken}` : ''}`);
                    const formatted = await result.json();
                    owned = owned.concat(formatted.items);
                    uniqueToken = formatted.next_page_params?.unique_token;
                } while (uniqueToken !== undefined);
                setOwned(owned);
            } catch (error) {
                console.log(error);
            }
        };
        nftContract !== "" && ethers.isAddress(nftContract) && provider.address && ethers.isAddress(provider.address) && pullOwned();
    }, [nftContract, provider]);
    

    return(
        <div className={styles.wrapper}>
            <div className={styles.backToMarketsBtn}>
                <p onClick={()=>{route.push('/market')}}>{`< `}Markets</p>
            </div>
            <HorizontalRule />
                <h1 className={styles.h1}>{projectName}</h1>
                <div className={registryInfo[3] === "" ? styles.hidden : styles.marketDescription}>{registryInfo[3]}</div>
                <div className={styles.marketSocials}>
                    <a target="_blank" className={registryInfo[4] === "" ? styles.hidden : styles.marketLink} href={registryInfo[4]!== "" ? registryInfo[4] : "https://basefellas.io"}><FontAwesomeIcon icon="fa-solid fa-globe" /></a>
                    <a target="_blank" className={registryInfo[5] === "" ? styles.hidden : styles.marketLink} href={registryInfo[5]!== "" ? registryInfo[5] : "https://basefellas.io"}><FontAwesomeIcon icon="fa-brands fa-x-twitter" /></a>
                    <a target="_blank" className={registryInfo[6] === "" ? styles.hidden : styles.marketLink} href={registryInfo[6]!== "" ? registryInfo[6] : "https://basefellas.io"}><FontAwesomeIcon icon="fa-brands fa-discord" /></a>
                    <a target="_blank" className={registryInfo[7] === "" ? styles.hidden : styles.marketLink} href={registryInfo[7]!== "" ? registryInfo[7] : "https://basefellas.io"}><FontAwesomeIcon icon="fa-brands fa-telegram" /></a>
                    <a target="_blank" className={registryInfo[8] === "" ? styles.hidden : styles.marketLink} href={registryInfo[8]!== "" ? registryInfo[8] : "https://basefellas.io"}><FontAwesomeIcon icon="fa-brands fa-github" /></a>
                </div>  
                <div onClick={()=>copyToClipboard()} className={styles.ctc}><div>{"basedfellas.io/market/"+shortenEthAddy(marketContract)}</div><div className={styles.ctci}><FontAwesomeIcon icon="fa-regular fa-copy" /></div></div>
                <div className={styles.ctcd}>Market Link</div>
            <HorizontalRule />
            {
            loading && !isValid ? <Loading /> :
            !loading && !isValid ? <div className={styles.loading}>{errormsg}</div> :
            loading && isValid ? <Loading /> :
            !loading && isValid ? null :
            null
            }
            <div className={loading || !isValid ? styles.hidden : styles.marketWrap }>
                <StatBox stats={stats} />
                <Listings owned={owned} setShowWallet={setShowWallet} showWallet={showWallet} registry={registry} registryInfo={registryInfo} width={width} alert={alert} reload={reload} stats={stats} provider={provider} isValid={isValid} setStats={setStats} stopLoading={stopLoading} projectName={projectName} marketContract={marketContract} nftContract={nftContract} />
            </div>
        </div>
    )
}

export default Market