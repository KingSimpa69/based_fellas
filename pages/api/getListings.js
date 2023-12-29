import connectDb from '../../functions/connectDB';

export default async function handler(req, res) {
  const client = await connectDb();
  try {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-api-key': process.env.OS_API_KEY },
    };
    
    await client.connect();

    const db = client.db('based_fellas');
    const listingsCollection = db.collection('listings');
    const firstListing = await listingsCollection.findOne();

    if (firstListing) {
      const currentTime = Math.floor(new Date() / 1000);
      const twoMinutesAgo = currentTime - 120;

      if (firstListing.lastchecked && firstListing.lastchecked >= twoMinutesAgo) {
        const allNfts = await listingsCollection.find().toArray();
        //console.log("Fetched from MongoDB")
        res.status(200).json(allNfts);
        return;
      }
    }

    let nextToken = null;
    let allNfts = [];

    do {
      const apiUrl = `https://api.opensea.io/api/v2/listings/collection/based-fellas/all?limit=100&next=${nextToken || ''}`;
      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        throw new Error(`OpenSea API request failed with status: ${response.status}`);
      }

      await listingsCollection.deleteMany({});

      const data = await response.json();
      const { listings, next } = data;
      if (listings && listings.length > 0) {
        allNfts = allNfts.concat(listings);
        await listingsCollection.insertMany(allNfts);
        for (const listing of listings) {

          listing.lastchecked = Math.floor(new Date() / 1000);

          await listingsCollection.updateOne(
            { order_hash: listing.order_hash },
            { $set: listing },
            { upsert: true }
          );
        }
      }

      next ? (nextToken = next) : (nextToken = null);
    } while (nextToken);
    //console.log("Fetched from OS")
    res.status(200).json(allNfts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
