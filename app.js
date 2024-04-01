require('dotenv').config(); 

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Changed to use mongoose for MongoDB interaction
const multer = require('multer'); 

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(error => console.error('Error connecting to MongoDB Atlas:', error));

const itemSchema = new mongoose.Schema({
  Name: String,
  Item_Category: String,
  Quantity: { type: Number, default: null },
  TotalItem: Number
});

const receiptSchema = new mongoose.Schema({
  Category: String,
  MerchantName: String,
  TransactionDate: Date,
  Items: [itemSchema],
  GrandTotal: Number
});

const Receipt = mongoose.model('Receipt', receiptSchema);

app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({ dest: 'uploads/' });

app.get('/api/receipts', async (req, res) => {
  try {
    const receipts = await Receipt.find({});
    res.json(receipts);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/upload', upload.single('receiptImage'), async (req, res) => {
  try {
    const filename = req.file.filename;
    res.json({ filename });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
