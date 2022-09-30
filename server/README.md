# START App Server
A node.js server connected to a mongo database for the START Project apps.

## Pre-requisites
- Download node.js and npm.
- Download docker / docker-compose.
- Create a google cloud platform project and enable the google drive API on it.
- Create a service account on that project and give it Owner permissions.
- Create a mongodb deployment / cluster and retrieve its connection link.
- Downloading mongoCompass will help you track the database changes.

## Environment Variables
This server depends on a set of environment variables that helps keep some data private from the codebase. 

- **PORT**: This is the port number that the server is going to run on. 
- **MONGODB**: Connection link to the deployment's database.
- **PARENT_FOLDER**: Destination folder id where exported entries will be uploaded.
- **PROJECT_ID**: Google Cloud Console project that we use for our API calls. Needs Drive API to be enabled.
- **CLIENT_EMAIL**: Service account email that the server is going to be impersonating.
- **PRIVATE_KEY**: Service account private key used to authenticate credentials with the email.

#### Notes:
- If connecting to an existing database use that url as your environment variable.
- Otherwise, you can setup a local database (recommended for development) as your envvironment variable. Default url: `http:\\localhost:27017`
- Make sure to invite the service account using its email to parent folder where the exported entries are to be uploaded. 

## Run Server with Docker
- Set the environment variables either on your system or in a `.env` file in the same root server `/server` directory as the `docker-compose.yml` file.
- Run `docker-compose up --build` to start the server using docker image.

## Run Server with npm
- Run `npm i` to install dependencies.
- Run `npm run dev` to start the server with live reload. 