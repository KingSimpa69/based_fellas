import styles from "@/styles/chests.module.css"
import { useEffect } from "react"
import { ethers } from "ethers"
import { useEthersProvider } from '@/hooks/ethers'
import ABI from "@/functions/abi.json"

const Winners = ({contract, refresh}) => {

    const chainId = 8453
    const provider = useEthersProvider(chainId)

    useEffect(()=>{
        let isMounted = true;

        const getPlayers = async () =>{
            const caseContract = new ethers.Contract(contract, ABI.chests, provider);
            const transactionFilter = caseContract.filters.WinnerSelected();
            const blockNumber = await provider.getBlockNumber();
            const logs = await caseContract.queryFilter(transactionFilter,blockNumber-2000,blockNumber);
            //logs.forEach(async (log) => {
            //    const parsedLog = caseContract.interface.parseLog(log);
            //    console.log(parseFloat(parsedLog.args[2]));
            //});
        }

        isMounted && contract !== undefined && getPlayers()

        return () => {
            isMounted = false;
          };
    },[contract,refresh])

    return (
        <h1>.</h1>
    )
}

export default Winners