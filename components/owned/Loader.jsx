import { useEffect, useState } from "react";
import styles from "../../styles/owned.module.css";
import Image from "next/image";
import { ethers } from "ethers";
import { useEthersProvider } from '../../hooks/ethers'
import ABI from "../../functions/abi.json"

const Loader = ({ address }) => {

    const chainId = 8453
    const provider = useEthersProvider(chainId)
    const [owned, setOwned] = useState([]);
    const [loading,setLoading] = useState(false)

  useEffect(() => {
    const checkOwnership = async () => {
        if (address !== undefined) {
          setOwned([]);
          const response = await fetch(`/api/getowned?addy=${address}`);
          const body = await response.json();
          const contractAddress = "0x217Ec1aC929a17481446A76Ff9B95B9a64F298cF";
          const verifiedOwned = [];
      
          try {
            const contract = new ethers.Contract(contractAddress, ABI.abi, provider);
            setLoading(true);
            for (const id of body) {
              await new Promise(resolve => setTimeout(resolve, 200));
              const owner = await contract.ownerOf(id);
              if (owner === address) {
                if (!verifiedOwned.includes(id)) {
                  verifiedOwned.push(id);
                  setOwned([...verifiedOwned]);
                }
              }
            }
      
            setLoading(false);
          } catch (error) {
            console.error(error);
          }
        }
      };

    if (address !== undefined) {
      checkOwnership();
    }
  }, []);

  return (
    <div className={styles.loader}>
      {owned.map((id) => (
        
        <div key={id} className={styles.fellacont}>
          <div className={styles.fellaoverlay}>
            <h1>{id}</h1>
          </div>
          <Image alt={`fella#${id}`} width={250} height={250} src={`/images/fellas/${id}.png`} />
        </div>
      ))}
      {loading === true ? "Verifying ownership..." :
      owned.length === 0 ? "You don't own any Based Fellas!" : ""}
    </div>
  );
};

export default Loader;
