import React, { useState, useEffect } from 'react';
import { ethers } from "ethers"
import { useEthersSigner } from "@/hooks/ethers"
import ABI from "@/functions/abi.json"
import REGISTRY from "@/registry.json"
import styles from "@/styles/market.module.css"
import { shortenEthAddy } from '@/functions/shortenEthAddy';
import formatETH from '@/functions/formatETH';

const MarketDataTable = ({changePage}) => {

    const provider = useEthersSigner()
    const [timeframe, setTimeframe] = useState('15m');
    const [marketData, setMarketData] = useState([]);
    const [marketContracts, setMarketContracts] = useState([]);

    const getMarketContract = async (marketID) => {
        try{
            const { chainId } = await provider.provider.getNetwork();
            const regContract = REGISTRY[parseInt(chainId)];
            const registry = new ethers.Contract(regContract, ABI.mreg, provider);
            const marketData = await registry.marketData(marketID)
            return marketData[1]
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMarketData = async () => {
        try {
            const response = await fetch(`/api/marketData?chain=84532&timeframe=${timeframe}`);
            const data = await response.json();
            const filteredData = data.filter(item => item.volChange !== 0 && item.volChange !== null);
            setMarketData(filteredData);
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    };

    const handleTimeframeChange = (e) => {
        setTimeframe(e.target.value);
    };

    useEffect(() => {
        fetchMarketData();
    }, [timeframe]);

    useEffect(() => {
        async function fetchMarketContracts() {
            const contracts = await Promise.all(
                marketData.map(item => getMarketContract(item.marketId))
            );
            setMarketContracts(contracts);
        }

        fetchMarketContracts();
    }, [marketData]);

    return (
        <div className={styles.dataTable}>
            <div className={styles.dataTableHeader}>
                <label htmlFor="timeframe-select">Timeframe:</label>
                <select id="timeframe-select" value={timeframe} onChange={handleTimeframeChange}>
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="6h">6 Hours</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="all">All</option>
                </select>
            </div>
            <div>
                <table className={styles.dataTableBody}>
                    <thead>
                        <tr>
                            <th>Market</th>
                            <th>Volume</th>
                            <th>Change</th>
                            <th>Floor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketData.map((item, index) => (
                            item.volChange !== "0" && item.volChange !== null &&(
                                <tr onClick={()=>changePage(`/market/${marketContracts[index]}`)} key={index}>
                                    <td>{ethers.isAddress(marketContracts[index]) ? shortenEthAddy(marketContracts[index]) : marketContracts[index]}</td>
                                    <td>{formatETH(parseFloat(item.mostRecent)/10**18)} ETH</td>
                                    <td>{parseFloat(item.volChange).toFixed(1)}%</td>
                                    <td>{formatETH(parseFloat(item.floorPrice)/10**18)} ETH</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MarketDataTable