// app/utils/mongodb.js
import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  console.log("Attempting to connect to the database... Are you sure you have wifi?")
  // Get uri from environment variable
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  try {
      await client.connect();
      console.log("Connected to the database.");
      return client;
  } catch (err) {
      console.error("Error connecting to the database.", err);
      throw err;
  }
}

export default connectToDatabase;
