import connectDb from './connectDB';

const getMarketData = async (chain,timeframe) => {
    const client = await connectDb();

    try {
        const database = client.db('based_fellas'); 
        const collection = database.collection(`${chain}_market_volumes`);

        let startDate;

        switch (timeframe) {
            case '15m':
                startDate = new Date(Date.now() - 900000); // 15 minutes ago
                break;
            case '30m':
                startDate = new Date(Date.now() - 1800000); // 30 minutes ago
                break;
            case '1h':
                startDate = new Date(Date.now() - 3600000); // 1 hour ago
                break;
            case '6h':
                startDate = new Date(Date.now() - 21600000); // 6 hours ago
                break;
            case '24h':
                startDate = new Date(Date.now() - 86400000); // 24 hours ago
                break;
            case '7d':
                startDate = new Date(Date.now() - 604800000); // 7 days ago
                break;
            case '30d':
                startDate = new Date(Date.now() - 2592000000); // 30 days ago
                break;
            case 'all':
                startDate = new Date(0); // Beginning of time
                break;
            default:
                throw new Error('Invalid timeframe');
        }

        const volumeData = await collection.find({ timestamp: { $gte: startDate } }).toArray();

        const marketDataMap = {};
        volumeData.forEach(data => {
            const marketId = data.marketId.toString();
            if (!marketDataMap[marketId]) {
                marketDataMap[marketId] = { hourAgo: null, mostRecent: null };
            }
            if (!marketDataMap[marketId].hourAgo || data.timestamp < marketDataMap[marketId].hourAgo.timestamp) {
                marketDataMap[marketId].hourAgo = data;
            }
            if (!marketDataMap[marketId].mostRecent || data.timestamp > marketDataMap[marketId].mostRecent.timestamp) {
                marketDataMap[marketId].mostRecent = data;
            }
        });

        const result = Object.keys(marketDataMap).map(marketId => {
            return {
                marketId: marketDataMap[marketId].mostRecent.marketId,
                hourAgo: marketDataMap[marketId].hourAgo.volume,
                mostRecent: marketDataMap[marketId].mostRecent.volume,
                volChange: (marketDataMap[marketId].mostRecent.volume - marketDataMap[marketId].hourAgo.volume) / marketDataMap[marketId].hourAgo.volume * 100,
                floorPrice: marketDataMap[marketId].mostRecent.floor
            };
        });

        return result;
    } catch (error) {
        console.error('Error fetching volume data:', error);
        throw new Error('Failed to fetch volume data');
    } finally {
        await client.close();
    }
}

export default getMarketData
