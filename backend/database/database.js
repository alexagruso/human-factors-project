// database.js

// Import the necessary MongoDB client
const { MongoClient } = require('mongodb');

// MongoDB Atlas connection details
const MONGO_URI = 'mongodb+srv://aym58:7RE8wxjhepp2EF69@cluster0.vvbzzw0.mongodb.net/<database>';
//const MONGO_URI = 'mongodb+srv://aym58:7RE8wxjhepp2EF69@cluster0.vvbzzw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let db;

// Function to connect to the MongoDB database
async function connectToDatabase() {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    // Connect to the MongoDB database
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    db = client.db('<database>');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
}

// Function to get a collection from the database
function getCollection(collectionName) {
  if (!db) {
    throw new Error('Database connection not established');
  }
  return db.collection(collectionName);
}

//Function to store receipt data in the database
async function storeReceipt(receiptData) {
  const collection = getCollection('receipts');
  try {
    const result = await collection.insertOne(receiptData);
    console.log('Receipt stored successfully:', result.insertedId);
  } catch (error) {
    console.error('Error storing receipt:', error);
  }
}

async function findExampleDocument(){
  const collection = getCollection('receipts');
  const document = await collection.findONe();
  console.log('Example Document:', document);
}

module.exports = { connectToDatabase, getCollection, storeReceipt, findExampleDocument };