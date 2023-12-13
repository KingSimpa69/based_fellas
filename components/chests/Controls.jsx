import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import ABI from "@/functions/abi.json"
import styles from "@/styles/chests.module.css"

const Controls = ({contract,triggerRefresh,refresh,alert}) => {

    const chainId = 8453
    const provider = useEthersSigner(chainId)

    const deposit = async () => {

        try{
            const caseContract = new ethers.Contract(contract, ABI.chests, provider);
            const tx = await caseContract.deposit({value: await caseContract.depositAmount()})
            alert("info","Awaiting transaction confirmation...")
            const receipt = await tx.wait();
            alert("success","Deposit successful!")
            receipt && triggerRefresh(refresh+1)
            console.log(receipt)
        } catch (e) {
            const actionRegex = /action="([^"]+)"/;
            const reasonRegex = /^(.*?)(?=\()/;
            const actionMatch = e.toString().match(actionRegex);
            const reasonMatch = e.toString().match(reasonRegex);
            const action = actionMatch ? actionMatch[1] : null;
            const reason = action === "estimateGas" ? 
            "Error: insufficient funds": 
            reasonMatch[1].trim();
            //console.log(e)
            alert("error",reason)
        }

    }


        return(
            <h1 onClick={()=>{deposit()}} className={styles.purpbutton}>Play</h1>
        )
}

export default Controls