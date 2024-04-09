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

fetch('/api/receipts')
  .then(response => response.json())
  .then(data => {
    console.log(data);
})
.catch(error => {
  console.error('Error fetching receipts:', error);
});

function handleSearch() {
  const searchQuery = document.querySelector('.searchInput').value;

  fetch(`/api/search?query=${searchQuery}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error searching:', error);
  });
}

document.querySelector('.searchInput').addEventListener('input', handleSearch);

async function submitReceipt(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('receiptImage', document.getElementById('receiptImage').files[0]);

  try {
    // Send the receipt image to the server
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    // Assuming the receipt data is returned from the server after processing the image
    const receiptData = {
      merchantName: data.merchantName,
      transactionDate: data.transactionDate,
      items: data.items,
      grandTotal: data.grandTotal
    };

    // Save the receipt data to the database
    const savedReceipt = await saveReceiptToDatabase(receiptData);
    console.log('Receipt saved to database:', savedReceipt);

    // Optionally, display a success message to the user
    alert('Receipt successfully uploaded and saved to database.');
  } catch (error) {
    console.error('Error uploading receipt:', error);
    // Optionally, display an error message to the user
    alert('Error uploading receipt. Please try again later.');
  }
}

// Function to save receipt data to the database
async function saveReceiptToDatabase(receiptData) {
  try {
    const response = await fetch('/api/saveReceipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(receiptData)
    });
    const savedReceipt = await response.json();
    return savedReceipt;
  } catch (error) {
    console.error('Error saving receipt to database:', error);
    throw error;
  }
}


/* less important functions tbh */
/* also I am so sorry i suck at explaining things */

function myFunction() {
  var element = document.body;
  element.classList.toggle("light-mode");
  var introductionSection = document.querySelector(".introduction");
  if (element.classList.contains("light-mode")) {
    introductionSection.style.backgroundImage = "url('lightMode.png')";
  } else {
    introductionSection.style.backgroundImage = "url('darkMode.png')";
  }
}

function showUploadOptions() {
  const uploadOptionsContainer = document.getElementById("uploadOptionsContainer");
  uploadOptionsContainer.style.display = "block";

  // Hide the "Scan or Upload Receipts" button
  const scanUploadButton = document.querySelector(".introduction button");
  scanUploadButton.style.display = "none";
}

let itemIndex = 1;

function addNewItemField() {
  const itemFieldsContainer = document.getElementById('itemFieldsContainer');
    const newItemField = document.createElement('div');
    newItemField.classList.add('item-field');
    newItemField.innerHTML = `
        <br><select class="itemType">
            <option value="Food">Food</option>
            <option value="Automotive">Automotive</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Clothes">Clothes</option>
            <option value="Miscellaneous">Miscellaneous</option>
        </select>
        <input type="text" class="itemName" name="itemName" placeholder="Item Name...">
        <input type="number" class="quantity" name="quantity" placeholder="Qty." style="width: 3.5em;">
        <input type="number" class="price" name="price" placeholder="Price">
    `;
  itemFieldsContainer.appendChild(newItemField);
}

function calculateTotalItems() {
  const totalItemsInput = document.getElementById('totalItems');
  const itemFields = document.querySelectorAll('.item-field');
  totalItemsInput.value = itemFields.length;
}

function calculateTotalAmount() {
  const totalAmountInput = document.getElementById('totalAmount');
  const itemFields = document.querySelectorAll('.item-field');
  let total = 0;
  itemFields.forEach(itemField => {
      const priceInput = itemField.querySelector('.price');
      if (priceInput.value) {
          total += parseFloat(priceInput.value);
      }
  });
  totalAmountInput.value = total.toFixed(2);
}

async function encodeImage() {
  const fileInput = document.getElementById('receiptImage');
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
      const base64String = event.target.result.split(',')[1]; // Extract base64 data
      submitReceipt(base64String);
  };

  reader.readAsDataURL(file);
}

async function submitReceipt(base64String) {
  try {
      console.log('Base64 encoded image:', base64String); // Should send base64String to the backend for processing
  } catch (error) {
      console.error('Error uploading receipt:', error);
  }
}

async function submitReceipt(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('receiptImage', document.getElementById('receiptImage').files[0]);

  try {
      const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
      });
      const data = await response.json();

      const receiptList = document.getElementById('receiptList');
      const listItem = document.createElement('li');
      listItem.innerHTML = `
          <p>Receipt Type: ${data.receiptType}</p>
          <p>Merchant Name: ${data.merchant_name}</p>
          <p>Transaction Date: ${data.transaction_date}</p>
          <p>Items:</p>
          <ul>
              ${data.items.map(item => `<li>Name: ${item.name}, Quantity: ${item.quantity}, Total: ${item.total_item}, Category: ${item.item_category}</li>`).join('')}
          </ul>
          <p>Grand Total: ${data.grand_total}</p>
      `;
          receiptList.appendChild(listItem);
      } catch (error) {
          console.error('Error uploading receipt:', error);
      }
  }

function takePicture() {
  // Add code here to take a picture using device camera
  alert('Feature under development.');
}

function openReceiptForm() {
  document.getElementById("manualEntryForm").style.display = "block";
}

function submitManualEntry(event) {
  event.preventDefault();
  calculateTotalItems();
  calculateTotalAmount();

  const merchantName = document.getElementById('merchantName').value;
  const transactionDate = document.getElementById('transactionDate').value;
  const itemCategory = document.getElementById('itemCategory').value;
  const totalItem = document.getElementById('totalItem').value;

  const itemData = [];
  const itemFields = document.querySelectorAll('.item-field');
  itemFields.forEach((itemField, index) => {
      const itemName = itemField.querySelector('.itemName').value;
      const quantity = itemField.querySelector('.quantity').value;
      itemData.push({ itemName, quantity });
  });

  const manualEntryData = {
      merchantName,
      transactionDate,
      itemCategory,
      totalItem,
      itemData
  };

      try {
          console.log('Manual entry data:', manualEntryData);
      } catch (error) {
          console.error('Error submitting manual entry:', error);
      }
  }
