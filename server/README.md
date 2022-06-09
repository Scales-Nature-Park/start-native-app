# START App Server
A node.js server connected to a mongo database for the START Project apps.

## Pre-requisites
- Download node.js and npm.
- Downloading mongoCompass will help you track the database changes.

## Configuration
This server depends on a mongo database for its operations. The server gets the mongo database url from an environment variable called `MONGODB`. 

- If connecting to an existing database use that url as your environment variable.
- Otherwise, you can setup a local database (recommended for development) as your envvironment variable. Default url: `http:\\localhost:27017`

## Run Server
- Install dependancy packages using `npm i`.
- Run dev script using `npm run dev`. 
