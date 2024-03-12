const { MongoClient } = require('mongodb');

// MongoDB connection details
const uri = 'mongodb+srv://aym58:7RE8wxjhepp2EF69@cluster0.vvbzzw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = "<database>";
const collectionName = "receipts";


async function storeReceipt(receiptData) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(receiptData);
        if (result.insertedCount === 1) {
            console.log("Receipt stored successfully");
        } else {
            console.error("Failed to store receipt");
        }
    } catch (error) {
        console.error("Error storing receipt:", error);
    } finally {
        await client.close();
    }
}


module.exports = { storeReceipt };
