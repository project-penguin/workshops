import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {};

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add the MONGODB_URI to your .env');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;