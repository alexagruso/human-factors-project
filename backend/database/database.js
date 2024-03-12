// database.js

const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://aym58:7RE8wxjhepp2EF69@cluster0.vvbzzw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = "<database>";

let db;

async function connectToDatabase() {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

function getCollection(collectionName) {
  if (!db) {
    throw new Error('Database connection not established');
  }
  return db.collection(collectionName);
}

async function storeReceipt(receiptData) {
  const collection = getCollection('receipts');
  try {
    const result = await collection.insertOne(receiptData);
    console.log('Receipt stored successfully:', result.insertedId);
  } catch (error) {
    console.error('Error storing receipt:', error);
  }
}

module.exports = { connectToDatabase, getCollection, storeReceipt };
