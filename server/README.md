# START App Server
A node.js server connected to a mongo database for the START Project apps.

## Pre-requisites
- Download node.js and npm.
- Downloading mongoCompass will help you track the database changes.

## Environment Variables
This server depends on a set of environment variables that helps keep some data private from the codebase. 

- **MONGODB**: Connection link to the deployment's database
- **PARENT_FOLDER**: Destination folder id where exported entries will be uploaded.
- **PROJECT_ID**: Google Cloud Console project that we use for our API calls. Needs Drive API to be enabled.
- **CLIENT_EMAIL**: Service account email that the server is going to be impersonating.
- **PRIVATE_KEY**: Service account private key used to authenticate credentials with the email.

#### Notes:
- If connecting to an existing database use that url as your environment variable.
- Otherwise, you can setup a local database (recommended for development) as your envvironment variable. Default url: `http:\\localhost:27017`
- Make sure to invite the service account using its email to parent folder where the exported entries are to be uploaded. 

## Run Server
- Install dependancy packages using `npm i`.
- Run dev script using `npm run dev`. 
