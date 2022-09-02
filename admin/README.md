# Admin App
A react-native-windows app that helps manages mobile app credentials, entry data and behavior.

## Pre-requisites 
- React-native docs has a helpful tutorial on [getting started with windows](https://microsoft.github.io/react-native-windows/docs/getting-started) for the first time.
- Download node.js and npm.
- Download react-native-cli.

## Configuration
The app is dependant on a node.js server, check [server readme](../server/README.md), so we need to make sure the connection route is configured properly and the sever is actually running.  

- Follow server readme to run the server locally on your machine.
- Create a json file in the [./utils/json](./utils/json) folder and name it `config.json`.
- Grab the server url and assign it to `server` element in the json file.
```js
{
    "server": "http://localhost:5000"
}
```

## Run Debug App 
- Install dependancy packages using `npm i`.
- cd into the admin directory from the root of the project in a terminal.
- Run `npm run windows` command.

## Run Release App 
- Install dependancy packages using `npm i`.
- cd into the admin directory from the root of the project in a terminal.
- Run `npm run windows-release` command.
