import { ethers } from "ethers"
import styles from "@/styles/market.module.css"
import { useEffect, useState } from "react"
import ABI from "@/functions/abi.json"
import Item from "./Item"
import BuyModal from "./BuyModal"
import ListingModal from "./ListingModal"
import MarketControlz from "./MarketControlz"
import DelistingModal from "./DelistingModal"
import LiquidateModal from "./LiquidateModal"
import AdminModal from "./AdminModal"
import BlockScoutItem from "./BlockScoutItem"

const Listings = ({owned, setShowWallet, showWallet, registryInfo, registry, alert, reload, marketContract, nftContract, stopLoading, setStats, isValid, provider }) => {

    const [id,setId] = useState("")
    const [listed, setListed] = useState([])
    const [prices,setPrices] = useState([])
    const [metaData,setMetaData] = useState([])
    const [updateComplete, setUpdateComplete] = useState(false);
    const [buyCrosshair,setBuyCrosshair] = useState(NaN)
    const [buyModal,setBuyModal] = useState(false)
    const [listingModal,setListingModal] = useState(false)
    const [delistingModal,setDelistingModal] = useState(false)
    const [liquidateModal,setLiquidateModal] = useState(false)
    const [adminModal,setAdminModal] = useState(false)
    const [owner,setOwner] = useState("")
    const [metaType,setMetaType] = useState("")


    const sortedListings = listed.map((e, index) => {
        return {
            index: index,
            id: e,
            price: prices[index],
            metaData: metaData[index]
        };
    }).sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    const getMetaDataType = async() => {
        const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
        const metaData = await nft.tokenURI(1)
        metaData.startsWith("ipfs://") ? setMetaType("ipfs") :
        metaData.startsWith("https://") || metaData.startsWith("http://") ? setMetaType("http") :
        metaData.startsWith("data:application/json") ? setMetaType("onchain") :
        setMetaType("IDFK")
        //console.log(metaData)
        return metaData.startsWith("ipfs://") ? "ipfs" :
        metaData.startsWith("https://") || metaData.startsWith("http://") ? "http" :
        metaData.startsWith("data:application/json") ? "onchain" :
        "IDFK"
    }

    useEffect(() => {
        if (updateComplete) {
            stopLoading();
        }
    }, [updateComplete]);

    useEffect(() => {
        const getListings = async () => {
            try{
                if(marketContract !== ""){
                    let metaDataArray = []
                    const market = new ethers.Contract(marketContract, ABI.market, provider);
                    const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
                    const ownerQuery = await nft.owner();
                    ownerQuery && setOwner(ownerQuery)
                    const volume = await market.volume()
                    const listedResponse = await market.getListedTokens()
                    const symbol = await nft.symbol();
                    const supply = await nft.totalSupply();
                    const lpBal = await provider.provider.getBalance(marketContract)
                    const priceArray = await Promise.all(listedResponse.map(async (e) => {
                        return await market.price(e);
                    }));
                    let prices = priceArray.map(bn => parseInt(bn));
    
                    const metaDataType = await getMetaDataType()
    
                    if(metaDataType === "ipfs"){
                        const ipfsGateway = 'https://ipfs.io/ipfs/';
                        metaDataArray = await Promise.all(listedResponse.map(async (e) => {
                            const baseUri = await nft.tokenURI(e);
                            const metaURL = ipfsGateway + baseUri.replace('ipfs://', '');
                            const response = await fetch(metaURL);
                            return response.json();
                        }));
                    } 
                    
                    if(metaDataType === "onchain"){
                        metaDataArray = await Promise.all(listedResponse.map(async (e) => {
                            const metaString = await nft.tokenURI(parseInt(e))
                            const jsonString = atob(metaString.split(',')[1]);
                            return JSON.parse(jsonString);
                        }));
                    }
    
                    if(metaDataType === "http"){
                        metaDataArray = await Promise.all(listedResponse.map(async (e) => {
                            const tokenURI = await nft.tokenURI(e);
                            const response = await fetch(tokenURI)
                            return response.json();
                        }));
                    } 
    
    
                    setStats({
                        totalVol: volume,
                        listed: listedResponse.length,
                        floor: Math.min(...prices),
                        symbol: symbol,
                        supply: supply,
                        lpBal: lpBal
                    })
    
                    setMetaData(metaDataArray)
                    setListed(listedResponse)
                    setPrices(priceArray)
                    setUpdateComplete(true);
                }
            } catch (e) {
                console.log(e)
            }
        }
        setUpdateComplete(false)
        getListings()
    }, [isValid,provider])

    useEffect(() => {
        console.log(owned)
    }, [owned])
    
    

    return( 
        <>
        <AdminModal registryInfo={registryInfo} registry={registry} alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} adminModal={adminModal} setAdminModal={setAdminModal}/>
        <BuyModal metaType={metaType} alert={alert} reload={reload} listed={listed} marketContract={marketContract} nftContract={nftContract} provider={provider} price={prices[parseInt(buyCrosshair)]} metaData={metaData[parseInt(buyCrosshair)]} buyModal={buyModal} setBuyModal={setBuyModal} id={parseInt(buyCrosshair)}/>
        <ListingModal id={id} setId={setId} metaType={metaType} alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} setListingModal={setListingModal} listingModal={listingModal} />
        <DelistingModal metaType={metaType} alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} setDelistingModal={setDelistingModal} delistingModal={delistingModal} />
        <LiquidateModal metaType={metaType} alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} setLiquidateModal={setLiquidateModal} liquidateModal={liquidateModal} />
        <div className={styles.listings}>
        <MarketControlz setShowWallet={setShowWallet} showWallet={showWallet} nftContract={nftContract} provider={provider} owner={owner} delistingModal={delistingModal} setDelistingModal={setDelistingModal} setListingModal={setListingModal} listingModal={listingModal} liquidateModal={liquidateModal} setLiquidateModal={setLiquidateModal} adminModal={adminModal} setAdminModal={setAdminModal} />
        <div className={styles.listingCont}>
        {!showWallet ? sortedListings.map(item => (
            <div onClick={() => { setBuyCrosshair(item.index); setBuyModal(!buyModal) }} key={item.index}>
                <Item metaType={metaType} id={item.id} price={item.price} metaData={item.metaData} />
            </div>
        )):
        owned.map((i)=>{
            return <BlockScoutItem setListingModal={setListingModal} listingModal={listingModal} setId={setId} i={i} />
        })
        }
        {listed.length === 0 && <div className={styles.noListings}>No listings!</div>}
        </div>
        </div>
        </>
    )
}

export default Listings