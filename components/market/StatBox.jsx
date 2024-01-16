import styles from "@/styles/market.module.css"
import formatETH from "@/functions/formatETH"

const StatBox = ({stats}) => {

    return(
        <div className={styles.statCont}>
            <div className={styles.statbox}>
                <div className={styles.statVal}>
                    {stats.floor === Infinity ? "N/A" : formatETH(parseFloat(stats.floor)/10**18) + " ETH"} 
                </div>
                <div className={styles.statTitle}>
                    Floor
                </div>
            </div>
            <div className={styles.statbox}>
                <div className={styles.statVal}>
                    {parseFloat(stats.listed)} {stats.symbol}
                </div>
                <div className={styles.statTitle}>
                    Listed
                </div>
            </div>
            <div className={styles.statbox}>
                <div className={styles.statVal}>
                    {formatETH(parseFloat(stats.totalVol)/10**18)} ETH
                </div>
                <div className={styles.statTitle}>
                    Volume
                </div>
            </div>
            <div className={styles.statbox}>
                <div className={styles.statVal}>
                    {parseFloat(stats.supply)} {stats.symbol}
                </div>
                <div className={styles.statTitle}>
                    Total Supply
                </div>
            </div>
            <div className={styles.statbox}>
                <div className={styles.statVal}>
                    {formatETH(parseFloat(stats.lpBal)/10**18)} ETH
                </div>
                <div className={styles.statTitle}>
                    Liquidity Pool
                </div>
            </div>
        </div>
    )
}

export default StatBox