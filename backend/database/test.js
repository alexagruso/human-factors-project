const { connectToDatabase, getCollection } = require('./database');

async function testDatabase() {
  await connectToDatabase();

  const collection = getCollection('receipts');

  // Example: Insert a document
  const result = await collection.insertOne({ name: 'Test Receipt', total: 50 });
  //console.log('Inserted document:', result.ops[0]);
  if (result.insertedCount === 1) {
    console.log('Inserted document:', result.ops[0]);
  } else {
        console.error('Failed to insert document');
  }


  // Example: Find documents
  const documents = await collection.find({}).toArray();
  console.log('Found documents:', documents);

  // Example: Update document
  const updateResult = await collection.updateOne({ name: 'Test Receipt' }, { $set: { total: 100 } });
  console.log('Updated document:', updateResult);

  // Example: Delete document
  const deleteResult = await collection.deleteOne({ name: 'Test Receipt' });
  console.log('Deleted document:', deleteResult);
}

testDatabase().catch(console.error);
