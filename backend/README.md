## Prerequisites
1) Make sure you have downloaded the trained model files and put them inside the backend folder:
```bash
https://drive.google.com/drive/folders/1znVc-zXkxsfeVjqlpKSRS5OnK6YgxcOO?usp=drive_link
```
2) Install the necessary libraries
```bash
pip install -r requirements.txt
```

3) Add your Azure Document Intelligence API keys and endpoint to server.py
```bash
endpoint = "<endpoint>"
key = "<key>"
````

## Running the application
Change your terminal's directory to the backend folder
```bash
Ex: cd "C:\Users\themo\Documents\GitHub\human-factors-project\backend"
```
Run
```bash
python server.py
```

## Docker

To build the docker container, run `docker build -t backend:backend .`.
To run the container, run `docker run -dp 127.0.0.1:3000:3000 --name backend backend:backend`.
If successful, you should be able to run `curl localhost:3000/api/rand` and get back random numbers.
After you run the container, you can use `docker stop backend` and `docker start backend` to start and stop it.
