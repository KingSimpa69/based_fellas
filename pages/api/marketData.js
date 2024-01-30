import getMarketData from "@/functions/getMarketData"

const marketData = async (req, res) => {
    const { chain, timeframe } = req.query;

    try {
        const volumeData = await getMarketData(chain,timeframe);
        res.status(200).json(volumeData);
    } catch (error) {
        console.error('Error fetching market data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default marketData
