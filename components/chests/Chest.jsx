import Image from "next/image"
import Controls from "./Controls"
import Winners from "./Winners"
import { useEffect,useState } from "react"
import { ethers } from "ethers"
import { useEthersProvider } from '@/hooks/ethers'
import ABI from "@/functions/abi.json"
import styles from "@/styles/chests.module.css"

const Chest = ({contract, refresh, triggerRefresh, alert}) => {
    const [currentPlayers, setCurrentPlayers] = useState(0)
    const [totalPlayers, setTotalPlayers] = useState(0)
    const [playerArray, setPlayerArray] = useState([])

    const chainId = 8453
    const provider = useEthersProvider(chainId)

    useEffect(()=>{
        let isMounted = true;

        const getPlayers = async () =>{
            const caseContract = new ethers.Contract(contract, ABI.chests, provider);
            setCurrentPlayers(parseInt(await caseContract.getTotalPlayers()))
            setTotalPlayers(parseInt(await caseContract.maxPlayers()))
            const playerList = await caseContract.getPlayers()
            playerList.length > 0 ? setPlayerArray(playerList) : setPlayerArray([])
        }

        isMounted && contract !== undefined && getPlayers()

        return () => {
            isMounted = false;
          };
    },[contract,refresh])

    return (
        <div className={styles.casedisplay}>
        <Image alt={"chest"} src={"/images/chest1.png"} width={180} height={180}/>
        <Controls alert={alert} refresh={refresh} triggerRefresh={triggerRefresh} contract={contract} />
        <div className={styles.playercont}>Players</div>
        <p className={styles.playercount}>{currentPlayers}/{totalPlayers}</p>
        {playerArray.map((e,index)=>(<div key={index} className={styles.playa}>{e}</div>))}
        <Winners refresh={refresh} triggerRefresh={triggerRefresh} contract={contract} />
        </div>
    )
}

export default Chest