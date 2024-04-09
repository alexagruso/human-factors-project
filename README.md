# Project installation/execution instructions

## Set up environment

Copy `.env.example` to `.env`

In `.env`, set `MONGODB_URI` to the URI provided by mongodb atlas, filling in your username and password. Ensure that it is using the `data` collection.

## Docker compose

To build the docker containers, run `docker compose build` with admin/sudo privileges.

Next, run `docker compose up` to start the application.
