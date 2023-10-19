import connectDb from '../../functions/connectDB'; 
import { ethers } from 'ethers';

const getOwned = async (req, res) => {
    const { query: { addy } } = req;

    if (!ethers.isAddress(addy)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
  
    try {
      const client = await connectDb();
      const db = client.db();
      const nftholders = db.collection('nftholders');
      const distinctIds = await nftholders.distinct('_id', { owner: addy });
  
      client.close();
  
      res.status(200).json(distinctIds);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export default getOwned