import { MongoClient } from 'mongodb';

const connectDb = async () => {
  try {
    const url =
      'mongodb+srv://si:Si%40210294@cluster0.mnn3d.mongodb.net/coderpush?retryWrites=true&w=majority';
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('coderpush');
    return db;
  } catch (error) {
    console.log('Can not connect to db: ', error);
    throw error;
  }
};

export default connectDb;
