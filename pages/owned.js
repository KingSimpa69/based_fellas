import HorizontalRule from '@/components/HorizontalRule';
import styles from '../styles/owned.module.css'
import { useAccount } from 'wagmi'
import dynamic from "next/dynamic";
const Loader = dynamic(
  () => import('@/components/owned/Loader'),
  { ssr: false }
)

export default function Owned() {

  const { isConnected, address } = useAccount()

  return (
    <div className={styles.wrapper}>
      <HorizontalRule />
        <h1 className={styles.h1}>Owned</h1>
        <p className={styles.threehnote}>Due to base rate limiting. Chain is only queried every three hours.</p>
      <HorizontalRule />
      <div className={styles.p}>{isConnected?<Loader address={address}/>:"Wallet not connected!"}</div>
    </div>
  )
}
