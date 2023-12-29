import Image from 'next/image';
import React, {useEffect,useState} from 'react';
import styles from "@/styles/index.module.css"

const OpenSeaStatBox = () => {

    const [listings,setListings] = useState([])
    const [listed,setListed] = useState(0)
    const [floor,setFloor] = useState(0)

    useEffect(()=>{
        let isMounted = true;

        const getListings = async () => {
            const response = await fetch("/api/getListings");
            const data = await response.json();
            //console.log(data)
            setListings(data)
        }

        if(isMounted){getListings()} 

        return () => {
            isMounted = false;
          };
    },[])

    useEffect(() => {
        if (listings.length > 0){
            const lowestPriceListing = listings.reduce((minPriceListing, currentListing) => {
                const currentPrice = parseFloat(currentListing.price.current.value);
                const minPrice = parseFloat(minPriceListing.price.current.value);
                if (currentPrice < minPrice) {
                  return currentListing;
                } else {
                  return minPriceListing;
                }
              }, listings[0]);
              setListed(parseFloat((listings.length / 10000)*100).toFixed(1))
              setFloor(parseFloat(lowestPriceListing.price.current.value) / 10 ** 18)
        }
    }, [listings])
    

  return (
        <div className={styles.osWrapper}>
            {listed === 0 ? "Loading..." : (
            <a href="https://opensea.io/collection/based-fellas" target="_blank">
            <div className={styles.osContainer}>
                <div className={styles.osStatContainer}>
                    <div className={styles.osStat}>
                        <div>{floor} ETH</div>
                        <p>Floor</p>
                    </div>
                    <div className={styles.osStat}>
                        <div>{listed}%</div>
                        <p>Listed</p>
                    </div>
                </div>
                <Image src={"/images/aoos.png"} height={43} width={120} />
            </div>
            </a>
            )}

        </div>
  );
};

export default OpenSeaStatBox;