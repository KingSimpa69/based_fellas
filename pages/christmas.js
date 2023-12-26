import styles from "@/styles/christmas.module.css"
import HorizontalRule from "@/components/HorizontalRule"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import { useAccount } from 'wagmi'
import Image from "next/image"
import ABI from "@/functions/abi.json"

export default function Christmas ({alert}) {

    const chainId = 8453
    const signer = useEthersSigner(chainId)
    const { isConnected } = useAccount()

    const mint = async () => {
        try{
            const crackaContract = new ethers.Contract("0xA98352617075580246aF6bbe83078c6c70C106dC", ABI.cracka, signer);
            const tx = await crackaContract.mint()
            alert("info","Minting...")
            const receipt = await tx.wait();
            await receipt.hash ? alert("success","Merry Christmas!") : null
        } catch (e){
            const pattern = /reason="([^"]*)"/;
            const match = pattern.exec(e.message);
            const pattern2 = /([^()]+) \(/;
            const nonContractMatch = pattern2.exec(e.message);
            const reason = match === null ? nonContractMatch[1] : match[1]
            alert("error",reason)
        }
    }

    return(
        <>
            <div className={styles.bghack} />
                <div className={styles.santaisfat}>

                <h1 className={styles.header}>🎄 Christmas Cracker Collection 🎄</h1>

                <p className={styles.p}>Exclusive Gift for A Very Based Christmas Party Attendees!</p>

                <h2 className={styles.header}>💰 Built-In Liquidity Pool 💰</h2>
                <p className={styles.p}>Every secondary market sale royalty is seamlessly directed to the Christmas Cracker smart contract, enriching the built-in liquidity pool with ETH. Invest in holiday spirit while supporting the project&apos;s sustainability.</p>

                <h2 className={styles.header}>💵 Redemption & Tax 💵</h2>
                <p className={styles.p}>Never wait for a buyer with our built-in liquidity pool & sellBack function! You can redeem your Christmas Cracker at any time, accompanied by a 10% redemption tax. This ensures a positive loop in liquidity, contributing to the long-term growth of the collection.</p>

                <h2 className={styles.header}>⏳ Redemption Cooldown ⏳</h2>
                <p className={styles.p}>To maintain price support and a healthy market, there&apos;s a one-month cooldown on buy-backs. This strategic cooldown period encourages a balance in buys/sells and adds stability to the Christmas Cracker price</p>

                <h2 className={styles.header}>🎨 On-Chain Metadata 🎨</h2>
                <p className={styles.p}>On-chain metadata—every detail and image is securely stored directly on the blockchain, eliminating reliance on external sources. Immerse yourself in the magic of the holidays with authentic, verifiable content.</p>
                <HorizontalRule />
                {
                    isConnected ? (
                        <>
                            <p className={styles.minttomint}>CLICK THE MINT BELOW TO MINT</p>
                            <div onClick={()=>mint()} className={styles.sigbutton}>
                            <Image alt={'mint'} src={'/images/mint.png'} width={100} height={100} />
                            </div>
                        </>
                    ) : (
                        <p className={styles.minttomint}>WALLET NOT CONNECTED</p>
                    )
                }
                </div>
        </>
    )

}