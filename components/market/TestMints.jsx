import styles from "@/styles/market.module.css"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import ABI from "@/functions/abi.json"

const TestMints = ({alert}) => {

    const provider = useEthersSigner()
    const [supplies, setSupplies] = useState([0,0,0])
    const [maxSupplies, setMaxSupplies] = useState([0,0,0])

    const contracts = [
        "0x91164C6e24CCbDFB82141Ca9EeC4EDaaE22d2114",
        "0xd1a9c44d57A728f57d6f4DF576154DD56D25F378",
        "0xf8c7ef5445d8706cc8a500e86570bf323b1d06f7"
    ]

    const getMinted = async (e) => {
        try {
            const nft = new ethers.Contract(contracts[e], e === 0 ? ABI.fellas : ABI.erc721, provider);
            const totalSupply = await nft.totalSupply();
            const maxSupply = e === 0 ? await nft.MAX_SUPPLY() :
            e === 2 ? 2000 : await nft.maxSupply();
    
            setSupplies(prevSupplies => {
                const updatedSupplies = [...prevSupplies];
                updatedSupplies[e] = parseInt(totalSupply);
                return updatedSupplies;
            });
    
            setMaxSupplies(prevMaxSupplies => {
                const updatedMaxSupplies = [...prevMaxSupplies];
                updatedMaxSupplies[e] = parseInt(maxSupply);
                return updatedMaxSupplies;
            });
        } catch (eroor) {
            console.log(eroor)
        }
    };

    const mint = async (e) => {
        try{
            const nft = new ethers.Contract(
                contracts[e], e === 0 ? ABI.fellas :
                e === 1 ? ABI.mystcl :
                ABI.erc721, provider);
            const mintPrice = e === 0 ? await nft.PRICE() :
            e === 1 ? await nft.price() :
            e === 2 ? null : null
            const tx = e === 0 ? await nft.mint(1,{value:mintPrice}) :
            e === 1 ? alert('error', "Public minting not enabled") :
            e === 2 ? alert('error', "Need ABI from Apex") : null
            e === 0 && alert("success","Minting...")
            const response = await tx.wait()
            response && alert("success","Success!")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchContracts = async () => {
            for (let index = 0; index < contracts.length; index++) {
                await getMinted(index);
            }
        };
        if (provider !== undefined) {
            fetchContracts();
        }
    }, [provider,alert]);

    return (
        <div className={styles.testMintCont}>
            <h1 className={styles.welcomeTestMint}>Welcome tester! It's not easy to find nft's on testnet. Here's some that you can mint from our friends. Once you have some NFTs, please try your hardest to break the market. Find bugs, provide as much feedback as possible so we can all build the best marketplace together</h1>
            <div className={styles.testMintContItem}>
                <h1>Based Fellas</h1>
                <img src={'/images/testmints/1.png'} />
                <p className={styles.testMintSupply}>{supplies[0]}/{maxSupplies[0]}</p>
                <div onClick={()=>mint(0)} className={styles.testMintBtn}>Mint</div>
            </div>
            <div className={styles.testMintContItem}>
                <h1>MYSTCL</h1>
                <img src={'/images/testmints/2.png'} />
                <p className={styles.testMintSupply}>{supplies[1]}/{maxSupplies[1]}</p>
                <div onClick={()=>mint(1)} className={styles.testMintBtn}>Mint</div>
            </div>
            <div className={styles.testMintContItem}>
                <h1>Based OnChain Dinos</h1>
                <img src={'/images/testmints/3.gif'} />
                <p className={styles.testMintSupply}>{supplies[2]}/{maxSupplies[2]}</p>
                <div onClick={()=>mint(2)} className={styles.testMintBtn}>Mint</div>
            </div>
        </div>
    )
}

export default TestMints