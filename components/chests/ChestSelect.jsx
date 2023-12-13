import { useState, useEffect } from "react";
import chests from "@/chests.json";
import styles from "@/styles/chests.module.css"
import { ethers } from "ethers";
import { useEthersProvider } from '../../hooks/ethers';
import ABI from "../../functions/abi.json";
import { shortenEthAddy } from "@/functions/shortenEthAddy";
import Image from "next/image";
import Link from "next/link";

const CaseSelect = () => {
  const [casez, setCasez] = useState([]);
  const chainId = 84532;
  const provider = useEthersProvider(chainId);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const updatedCasez = await Promise.all(chests.config.map(async (e) => {
          let contract = new ethers.Contract(e.addy, ABI.chests, provider);
          let players = await contract.maxPlayers();
          let buyin = await contract.depositAmount();
          return {
            id: e.id,
            addy: e.addy,
            players: players,
            buyin: buyin,
          };
        }));

        const existingIds = new Set(casez.map(item => item.id));
        const filteredUpdatedCasez = updatedCasez.filter(item => !existingIds.has(item.id));

        if (filteredUpdatedCasez.length > 0 && isMounted) {
          setCasez(prevCasez => [...prevCasez, ...filteredUpdatedCasez]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (casez.length === 0) {
      fetchData();
    } else {
      // console.log(casez)
    }

    return () => {
      isMounted = false;
    };
  }, [chests.config, provider, casez]);

  return (
    <div className={styles.chests}>
      {casez.length === 0 ? (<h1 className={styles.nonefound}>No chest contracts found</h1>) : null}
      {casez.map((e,index)=>{
        return(
        <div key={index}>
        <Link href={`chests/${index}`}>
          <div className={styles.casecontainer}>
            <div className={styles.image}><Image alt={"chest" + e.id} src={"/images/chest1.png"} width={150} height={150}/></div>
            <div className={styles.stat}><div className={styles.key}>Chest Id</div><div className={styles.value}>{parseInt(e.id)}</div></div>
            <div className={styles.stat}><div className={styles.key}>Contract</div><div className={styles.value}>{shortenEthAddy(e.addy)}</div></div>
            <div className={styles.stat}><div className={styles.key}>Players</div><div className={styles.value}>{e.players.toString()}</div></div>
            <div className={styles.stat}><div className={styles.key}>Entry</div><div className={styles.value}>{parseInt(e.buyin) / 10 ** 18} ETH</div></div>
            <div className={styles.stat}><div className={styles.key}>Payout</div><div className={styles.value}>{(parseInt(e.buyin) / 10 ** 18)*parseInt(e.players)} ETH</div></div>
          </div>
        </Link>
        </div>
        )
      })}
    </div>
  );
};

export default CaseSelect;
