from flask import Flask, send_from_directory, request
import random
import base64
import os
import json
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
endpoint = "<your-endpoint>"
key = "<your-key>"

class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

app = Flask(__name__)

@app.route("/api/image_process", methods = ['GET', 'POST'])
def processImage():
     return request.data

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
            receipt['Category'] = 'N/A'
        merchant_name = receipt.fields.get("MerchantName")
        if merchant_name:
            receiptDict['MerchantName'] = merchant_name.value
        else:
            receipt['MerchantName'] = 'N/A'
        transaction_date = receipt.fields.get("TransactionDate")
        if transaction_date:
            receiptDict['TransactionDate'] = str(transaction_date.value)
        else:
            receiptDict['TransactionDate'] = 'N/A'
        if receipt.fields.get("Items"):
            receiptDict['Items'] = []
            for idx, item in enumerate(receipt.fields.get("Items").value):
                receiptItemsDict = {} #reset the items
                item_description = item.value.get("Description")
                if item_description:
                    receiptItemsDict['Name'] = item_description.value
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
    app.run(debug=True, host="localhost", port="3000")
