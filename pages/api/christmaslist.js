import connectDb from '../../functions/connectDB';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const client = await connectDb();
    const db = client.db('based_fellas');
    const crackerListCollection = db.collection('crackerList');
    const allEntries = await crackerListCollection.find({}).toArray();
    return res.status(200).json({ christmasList: allEntries });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
}
