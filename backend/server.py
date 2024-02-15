from flask import Flask, send_from_directory, request
import random
import base64

app = Flask(__name__)

@app.route("/api/image_process", methods = ['GET', 'POST'])
def processImage():
     return request.data

@app.route("/api/ocr_handler", methods = ['GET', 'POST'])
def ocrTool():
    if(request.json):
        base64Img = request.json.get("image");
        #print(base64Img);
        fh = open('imageToSave.jpg', 'wb')
        fh.write(base64.b64decode(base64Img))
        fh.close()
    return "TEST_MESSAGE"


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port="3000")
