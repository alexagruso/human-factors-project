from flask import Flask
from waitress import serve
import random


print("Server running on port 3000")

app = Flask(__name__)

@app.route("/api/rand", methods = ['GET', 'POST'])
def randomNumber():
    randomNum = random.randint(1, 10)
    return str(randomNum)


if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=3000)
