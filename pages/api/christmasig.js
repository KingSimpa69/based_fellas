import connectDb from '../../functions/connectDB';
import { verifyMessage } from 'ethers';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { address, signature, message } = req.body;

  try {
    const client = await connectDb();
    const db = client.db('based_fellas');
    const crackerListCollection = db.collection('crackerList');
    const existingEntry = await crackerListCollection.findOne({ wallet: address, xuser: message });

    if (existingEntry) {
      return res.status(409).json({ message: 'Already signed!' });
    }

    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      const result = await crackerListCollection.insertOne({
        wallet: address,
        xuser: message,
      });
      console.log(result)
      return res.status(200).json({ message: 'Signature verified!' });
    } else {
      return res.status(401).json({ message: 'Invalid signature!' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
}
