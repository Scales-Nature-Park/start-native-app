# START App
A react-native mobile application for the START project.

## Pre-requisites
- React-native docs has a helpful tutorial on [setting up the environment](https://reactnative.dev/docs/environment-setup) for the first time.
- Download node.js and npm.
- Download react-native-cli using `npm i -g react-native-cli`.
- Download Android studio.
- Setup JAVA_HOME environment variable and Android studio paths in the path variable.

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
If you are on Linux/Windows, you will be using Android Studio or a physical android device to test for android. MacOS has XCode emulator to test for IOS and Android Studio to test for Android.
- Install dependancy packages using `npm i`.
- cd into the app directory from the root of the project in a terminal.
- Run `npm start` to start metro.
- cd into the app directory from another terminal instance.
- Run for android using `npm run android`.
- Run for ios using `npm run ios`.

## Run Release App
- Run the following command in [`./android/app`](./android/app) directory: `keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`.
    * This will prompt you for a password and bunch of questions.
- Edit the following in [`./android/gradle.properties`](./android/gradle.properties):
    * `MYAPP_UPLOAD_STORE_PASSWORD=*****`
    * `MYAPP_UPLOAD_KEY_PASSWORD=*****`
- cd into [`./android`](./android) and run the following commands:
    * ./gradlew assembleRelease
    * ./gradlew bundleRelease
- Now you should have a set of apk files in the following path [`./android/app/build/outputs/apk/release`](./android/app/build/outputs/apk/release). These files can be uploaded to a shareable link such as google drive and be distributed to users. 
- To test the release version of the app, delete any previous debug version on your device, physical or emulator and run `npm run android-release` in the [current directory](.).