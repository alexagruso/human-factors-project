# Project installation/execution instructions

## Node

Make sure `node` and `npm` are installed.

## Connect to MongoDB

Navigate to `frontend/`.

Copy `.env.example` to `.env`

In `.env`, set `MONGODB_URI` to the URI provided by mongodb atlas, filling in your username and password.

## Install dependencies

Run `npm install`.

## Dev server

Run `npm run dev`. Further instructions are provided by vite.

<!--  TODO: read documentation on sveltekit adapters -->
## Production server

Run `npm run build`, then `npm run preview`.
