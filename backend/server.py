from flask import Flask, send_from_directory, request
import random
import base64
from PIL import Image
from io import BytesIO
import pandas as pd
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
import re

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<endpoint>"
key = "<key>"

df = pd.read_csv('ourDataset.csv', usecols=['name', 'main_category'])

# Feature extraction using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['name'])

# Target variable
y = df['main_category']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the Linear Support Vector Classifier
classifier = LinearSVC()

# Train the classifier
classifier.fit(X_train, y_train)

# Predictions on the test set
#y_pred = classifier.predict(X_test)

class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

app = Flask(__name__)

@app.route("/api/imageUpload", methods = ['GET', 'POST'])
def testImage():
    base64Request = request.json.get("image")
    image_data = re.sub('^data:image/.+;base64,', '', base64Request)
    im = Image.open(BytesIO(base64.b64decode(image_data)))
    return str(im.width)


@app.route("/api/rand", methods = ['GET', 'POST'])
def randomNumber():
    randomNum = random.randint(1, 10)
    return str(randomNum)

@app.route("/api/ocr_handler", methods = ['GET', 'POST'])
def ocrTool():
    receiptDict = {}
    document_analysis_client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
    base64Img = request.json.get("image") #whatever we set the name as
    image = base64.b64decode(base64Img) 
    poller = document_analysis_client.begin_analyze_document("prebuilt-receipt", document=image, locale="en-US")
    receipt = poller.result()
    for idx, receipt in enumerate(receipt.documents):
        receiptType = receipt.doc_type
        if(receiptType):
            receiptDict['Category'] = 'PLACEHOLDER'
        else:
            receiptDict['Category'] = 'N/A'
        merchant_name = receipt.fields.get("MerchantName")
        if merchant_name:
            receiptDict['MerchantName'] = merchant_name.value
        else:
            receiptDict['MerchantName'] = 'N/A'
        transaction_date = receipt.fields.get("TransactionDate")
        if transaction_date:
            receiptDict['TransactionDate'] = str(transaction_date.value)
        else:
            receiptDict['TransactionDate'] = 'N/A'
        if receipt.fields.get("Items"):
            receiptDict['Items'] = []
            for idx, item in enumerate(receipt.fields.get("Items").value):
                inferredResult = "null"
                new_description = []
                receiptItemsDict = {} #reset the items
                item_description = item.value.get("Description")
                if item_description:
                    receiptItemsDict['Name'] = item_description.value
                    new_description.append(item_description.value)
                    new_description_vectorized = vectorizer.transform(new_description)
                    predicted_category = classifier.predict(new_description_vectorized)
                    if(predicted_category[0] != 'Food' and predicted_category[0] != 'grocery & gourmet foods'): #two types of item expenses on receipts, food and shopping (yes many categories of shopping but they're all just shopping)
                        inferredResult = 'Shopping/Entertainment'
                    else:
                        inferredResult = 'Food'
                    receiptItemsDict['Item_Category'] = inferredResult
                else:
                    receiptItemsDict['Name'] = 'N/A'
                item_quantity = item.value.get("Quantity")
                if item_quantity:
                    receiptItemsDict['Quantity'] = item_quantity.value
                else:
                    receiptItemsDict['Quantity'] = 'N/A'
                item_total_price = item.value.get("TotalPrice")
                if item_total_price:
                    receiptItemsDict['TotalItem'] = item_total_price.value
                else:
                    receiptItemsDict['TotalItem'] = 'N/A'
                receiptDict["Items"].append(receiptItemsDict)
        total = receipt.fields.get("Total")
        if total:
            receiptDict['GrandTotal'] = total.value
        else:
            receiptDict['GrandTotal'] = 'N/A'
        data_str = json.dumps(receiptDict, cls=SetEncoder)
        #with open('data.json', 'w') as f:
            #json.dump(receiptDict, f, cls=SetEncoder, indent=4, separators=(',', ': '))
        #maybe use this for formatting
        #print(data_str)
    return data_str


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port="3000")
