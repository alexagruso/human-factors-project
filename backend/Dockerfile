FROM python:3.10-bookworm

WORKDIR /backend
COPY . .

RUN pip install -r requirements.txt

CMD ["python", "server.py"]
EXPOSE 3000
