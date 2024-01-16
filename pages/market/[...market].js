import styles from "@/styles/market.module.css"
import HorizontalRule from "@/components/HorizontalRule"
import Listings from "@/components/market/Listings"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import ABI from "@/functions/abi.json"
import Loading from "@/components/market/Loading"
import delay from "@/functions/delay"
import StatBox from "@/components/market/StatBox"


const Market = ({goodToTx,alert}) => {

    const [stats,setStats] = useState({})
    const [marketContract,setMarketContract] = useState("")
    const [nftContract, setNftContract] = useState("")
    const [projectName,setProjectName] = useState("Market")
    const provider = useEthersSigner()
    const [loading,setIsLoading] = useState(true)
    const [isValid,setIsValid] = useState(false)
    const route = useRouter();

    const stopLoading = async () => {
        await delay(1500)
        setIsLoading(false)
    }

    const reload = async () => {
        setIsValid(false)
        setIsLoading(true)
        await checkMarket(route.query.market[0], provider)
    }

    const checkMarket = async (marketAddress, currentProvider) => {
        if(!goodToTx.connected || !goodToTx.network){route.push('/market')}
        try {
            const market = new ethers.Contract(marketAddress.toString(), ABI.market, currentProvider);
            const projectName = await market.projectName();
            const nftContract = await market.nftContract();
            if (projectName && nftContract) {
                setMarketContract(marketAddress);
                setNftContract(nftContract);
                setProjectName(projectName + " Market");
                setIsValid(true)
            }
        } catch (error) {
            setIsValid(false);
            stopLoading()
        }
    };
    
    useEffect(() => {
        const fetchMarket = async () => {
            if (provider !== undefined && goodToTx && route.query.market) {
                const currentProvider = provider;
                ethers.isAddress(route.query.market[0]) ? await checkMarket(route.query.market[0], currentProvider) : stopLoading()
            }
        };
        fetchMarket();
    }, [provider]);

    return(
        <div className={styles.wrapper}>
            <HorizontalRule />
                <h1 className={styles.h1}>{projectName}</h1>
            <HorizontalRule />
            {
            loading && !isValid ? <Loading /> :
            !loading && !isValid ? <div className={styles.loading}>Error loading market contract</div> :
            loading && isValid ? <Loading /> :
            !loading && isValid ? null :
            null
            }
            <div className={loading || !isValid ? styles.hidden : styles.marketWrap }>
                <StatBox stats={stats} />
                <Listings alert={alert} reload={reload} stats={stats} provider={provider} isValid={isValid} setStats={setStats} stopLoading={stopLoading} projectName={projectName} marketContract={marketContract} nftContract={nftContract} />
            </div>
        </div>
    )
}

export default Market