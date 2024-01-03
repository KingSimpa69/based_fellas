import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useEthersSigner } from "@/hooks/ethers"
import styles from "@/styles/owned.module.css"
import Image from 'next/image';
import ABI from '@/functions/abi.json'

const TransferModal = ({ alert, id, account, showModal, closeModal }) => {
  const fellAddy = "0x217Ec1aC929a17481446A76Ff9B95B9a64F298cF";
  const chainId = 8453
  const [recipientAddress, setRecipientAddress] = useState('');
  const provider = useEthersSigner(chainId)

  const handleTransfer = async () => {
    try {
      if (!ethers.isAddress(recipientAddress)) {
        alert('error','Not a valid ETH address!');
        return;
      }

      const contract = new ethers.Contract(fellAddy, ABI.fellas, provider);
      const tx = await contract.safeTransferFrom(provider.address, recipientAddress, id);
      alert("info","Awaiting transaction confirmation...")
      const receipt = await tx.wait();
      alert('success','NFT transferred successfully');
      closeModal();
    } catch (error) {
      console.error('Error transferring NFT:', error.message);
      alert('error','Error transferring NFT');
    }
  };

  return (
    <div className={styles[showModal?"transferWrapper":"hidden"]}>
        <div className={styles.transferConatiner}>
            <div className={styles.modalHead}>
                Transfer NFT
            </div>
            <div className={styles.modalBody}>
                <div className={styles.transferFellaInfo}>
                <Image src={`/images/fellas/${id}.png`} width={100} height={100} />
                {id}
                </div>
                <div className={styles.transferFellaInput}>
                    <input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} onchange={(e)=>setRecipientAddress(e.target.value)} className={styles.transferInput} placeholder='Enter A Valid ETH Address'/>
                    <div className={styles.walletConfirm}>Always double check the wallet address!</div>
                </div>
            </div>
            <div className={styles.modalButtons}>
                <p onClick={()=>closeModal()} className={styles.transferCancelBtn}>Cancel</p>
                <p onClick={()=>handleTransfer()} className={styles.transferSendBtn}>Send</p>
            </div>
        </div>
    </div>
  );
};

export default TransferModal;
