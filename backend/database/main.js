// main.js

// Import the necessary MongoDB client
const { MongoClient } = require('mongodb');

// MongoDB connection details
const uri = 'mongodb+srv://aym58:7RE8wxjhepp2EF69@cluster0.vvbzzw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = "<database>";    
const collectionName = "receipts";

// Function to store receipt data in the database
async function storeReceipt(receiptData) {

    // Create a new MongoDB client
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


    try {

        // Connect to the MongoDB database
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the receipt data into the collection
        const result = await collection.insertOne(receiptData);
        if (result.insertedCount === 1) {
            console.log("Receipt stored successfully");
        } 
        else {
            console.error("Failed to store receipt");
        }
    } catch (error) {
        console.error("Error storing receipt:", error);
    } finally {
        // Close the client connection
        await client.close();
    }
}

module.exports = { storeReceipt };