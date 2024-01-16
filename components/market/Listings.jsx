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

const Listings = ({alert, reload, marketContract, nftContract, stopLoading, setStats, isValid, provider }) => {

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
    const sortedListings = listed.map((e, index) => {
        return {
            index: index,
            id: e,
            price: prices[index],
            metaData: metaData[index]
        };
    }).sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    const getListings = async () => {
        try{
            if(marketContract !== ""){
                const market = new ethers.Contract(marketContract, ABI.market, provider);
                const nft = new ethers.Contract(nftContract, ABI.fellas, provider);
                const ownerQuery = await nft.owner();
                ownerQuery && setOwner(ownerQuery)
                const ipfsGateway = 'https://ipfs.io/ipfs/';
                const baseUri = await nft.baseURI();
                const symbol = await nft.symbol();
                const supply = await nft.totalSupply();
                const lpBal = await provider.provider.getBalance(marketContract)
                const metaURL = ipfsGateway + baseUri.replace('ipfs://', '');
                const volume = await market.volume()
                const listedResponse = await market.getListedTokens()
                const priceArray = await Promise.all(listedResponse.map(async (e) => {
                    return await market.price(e);
                }));
                let prices = priceArray.map(bn => parseInt(bn));
                const metaDataArray = await Promise.all(listedResponse.map(async (e) => {
                    const response = await fetch(metaURL+e);
                    return response.json();
                }));
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

    useEffect(() => {
        if (updateComplete) {
            stopLoading();
        }
    }, [updateComplete]);

    useEffect(() => {
        setUpdateComplete(false)
        getListings()
    }, [isValid,provider])
    

    return( 
        <>
        <AdminModal alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} adminModal={adminModal} setAdminModal={setAdminModal}/>
        <BuyModal alert={alert} reload={reload} listed={listed} marketContract={marketContract} nftContract={nftContract} provider={provider} price={prices[buyCrosshair]} metaData={metaData[buyCrosshair]} buyModal={buyModal} setBuyModal={setBuyModal} id={buyCrosshair}/>
        <ListingModal alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} setListingModal={setListingModal} listingModal={listingModal} />
        <DelistingModal alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} setDelistingModal={setDelistingModal} delistingModal={delistingModal} />
        <LiquidateModal alert={alert} reload={reload} marketContract={marketContract} nftContract={nftContract} provider={provider} setLiquidateModal={setLiquidateModal} liquidateModal={liquidateModal} />
        <div className={styles.listings}>
        <MarketControlz provider={provider} owner={owner} delistingModal={delistingModal} setDelistingModal={setDelistingModal} setListingModal={setListingModal} listingModal={listingModal} liquidateModal={liquidateModal} setLiquidateModal={setLiquidateModal} adminModal={adminModal} setAdminModal={setAdminModal} />
        <div className={styles.listingCont}>
        {sortedListings.map(item => (
            <div onClick={() => { setBuyCrosshair(item.index); setBuyModal(!buyModal) }} key={item.index}>
                <Item id={item.id} price={item.price} metaData={item.metaData} />
            </div>
        ))}
        {listed.length === 0 && <div className={styles.noListings}>No listings!</div>}
        </div>
        </div>
        </>
    )
}

export default Listings