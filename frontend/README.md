# Project installation/execution instructions

## Set up environment

Copy `.env.example` to `.env`

In `.env`, set `MONGODB_URI` to the URI provided by mongodb atlas, filling in your username and password.

## Docker

To build the docker container, run `docker build -t frontend:frontend .`.

To run the container, run `docker run -dp 5000:5000 --name frontend frontend:frontend`.

If successful, you should be able to access `localhost:5000` in your browser.

After you run the container, you can use `docker stop backend` and `docker start backend` to start and stop it.

## Dev server

Run `npm run dev`. Further instructions are provided by vite.

<!--  TODO: read documentation on sveltekit adapters -->
## Production server

Run `npm run build`, then `npm run preview`.
