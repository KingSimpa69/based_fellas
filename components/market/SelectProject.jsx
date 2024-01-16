import styles from "@/styles/market.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SelectContractModal from "./SelectProjectModal"
import { useState } from "react"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import DeployModal from "./DeployModal"
import { useRouter } from "next/router"

const SelectProject = ({alert,chain,changePage,goodToTx}) => {

    const { open } = useWeb3Modal()
    const [modalOpen,setModalOpen] = useState(false)
    const [deployModal,setDeployModal] = useState(false)
    const router = useRouter();
    

    const dynamicModalButton = () => {
        !goodToTx.connected ? open({ view: 'Connect' }) :
        goodToTx.network ? setModalOpen(!modalOpen) : open({ view: 'Networks' })
    }

    return(
        <>
        <DeployModal router={router} alert={alert} deployModal={deployModal} setDeployModal={setDeployModal}/>
            <SelectContractModal chain={chain} setModalOpen={setModalOpen} modalOpen={modalOpen} changePage={changePage} />
            <div className={styles.selectProjectConatiner}>
                <div onClick={()=>(dynamicModalButton())} className={styles.selectProjectButton}>
                    <div className={styles.spbLeft}>
                            {
                            !goodToTx.connected ? <p>Wallet not connected</p> :
                            goodToTx.network ? <p>Select a contract</p> : <p>Wrong network</p>}
                    </div>
                    <div className={styles.spbRight}>
                        <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                    </div>
                </div>
                <div onClick={()=>setDeployModal(!deployModal)} className={styles.deployAContractButton}>
                    <p>Can&apos;t find a market for your NFT? Deploy one!</p>
                </div>
            </div>
        </>
    )
}

export default SelectProject