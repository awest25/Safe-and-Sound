// app/utils/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
console.log('uri', uri);
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}
console.log('uri', uri);

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the state of the database connection
  // across module reloads which could cause state loss in development mode
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  console.log('clientPromise', clientPromise);
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
  console.log('clientPromise', clientPromise);
}

export default clientPromise;
