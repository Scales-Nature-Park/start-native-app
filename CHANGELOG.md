# ChangeLog
This file is intended for tracking development progress, edit this file everytime you make changes to the codebase with a message stating your changes; Example: ```Implemented Components A & B.``` For longer and more complex
changes, please include a short explanation of what your changes are trying to achieve, how they're integrated
with the rest of the codebase and/or how to run and build up on them. You can treat this file as a more in depth
commit log and place your changes over the previous changes, below this message.

## Bug Fix
#### Changes:
Issue [#4](https://github.com/Scales-Nature-Park/start-native-app/issues/4) seemed to be resolved when you select something from the last dropdown in the search screen. From what I understand, the selections state had different values when accessed from different dropdown's onSelect function, so the current solution is to call the most recent onSelect to update the selections state making it include all dropdowns. 
- Used refs to programmatically select the last dropdown before a new criteria is added and after any other dropdowns were selected.
- This fixes the issue for now but further work may be needed on this in the future.

## Account Screen
#### Changes: 
- Created an account screen that can only be accessed in online mode.
- Added an update password feature and delet account feature in the account screen.
- Created backend support for both features.

#### Known Issues: 
- Reopend issue [#4](https://github.com/Scales-Nature-Park/start-native-app/issues/4)

## Network Checks & Seperate Styles
#### Changes:
- Added network errors if a user attempts to perform server requests while disconnected from the internet.
- Added a seperate `styles` folder for all the stylesheet objects.
- Added support for multiple image uploads. [#6](https://github.com/Scales-Nature-Park/start-native-app/issues/6)

## Admin Windows App
#### Changes:
- Added react native boiler plate for windows admin app.
- Created a login screen that can only enter existing credentials in the `admin-credentials` collection in our database.

#### How to Use:
- cd into admin folder and run `npm start` and `npm run windows`.
- You might need to install a windows SDK dependancy from visual studio installer.

#### Known Issues:
- [Issue #5](https://github.com/Scales-Nature-Park/start-native-app/issues/5).

## Image Upload and Retrieval 
#### Changes:
- Implemented full functionality for image upload with data entry form.
- Saving to mobile drive or uploading to server now supports images.
- Created an endpoint with a `photoId` parameter that sends the image file in response.

#### How to Use: 
- To access the image enter the server url followed by the endpoint name and photo id. e.g. `http://<server domain>:PORT/image/<photo id from database>`

## Image Upload to node Server
#### Changes: 
- Implemented image upload from the `Data Entry` screen form. 
    * App handles image selection form the user's library, an initial post request is sent to the server with just an image form.
    * `/imageUpload` endpoint then moves that image to the `uploads` folder in the server's root directory.

#### Future Improvements: 
- ~~Add a document to the `images` collection in the database with all the image data.~~
- ~~Store the ObjectID of that document in the next post request directed to the `/dataEntry` endpoint.~~
- ~~Accessing the image later should be simply retrieving the image id from the entry document and looking it up in `images`, then finding the image from uploads folder and sending the file to the front end.~~


## fields.json minor changes and bug fixes
#### Changes:
- Fixed a problem where the search fields where looking for integers but the existing format in the database was as string. Changed the `dataEntry` endpoint to always switch the value to a number if the field is specified as `isNumber` in dataValidation element from `field.json`
- Added a GUI display for the search results using the Entry component previously used in `PrevEntries.js`. A user can now access a returned entry by clicking on its tab which will bring the user to `Data Entry` screen with a copy of that entry. 

#### How to Use:
- For any field in data entry that needs to be queried as a number from the search screen, you should have an indication that this value should be a number. i.e 
```json 
{
    "dataValidation": {
        "isNumber": true,
        "arguments": "input",
        "body": "return (!isNaN(input))",
        "error": "Value needs to be a number."
    }
}
```
- At the very least, your body of the condition should have ```(!isNaN(input)) // not is not a number```.
- You can add more conditions using `&&`. You don't have to specify this if you don't need to data validate the field and will not make this field searchable in `search.json`.

#### Known Issues:
- ~~Navigation when using `save` or `quick save` in data entry screen causes a problem where the user is allowed to Submit to the server in offline mode. Data validation would still work but we don't want users accessing our database without credentials.~~


## Search Server Side Functionality
#### Changes:
- Integrated a generic search engine endpoint that parses field names and queries the database based on the string values.
- Fixed an issue with the data entry endpoint where the `inputFields` list was storing string values instead of BSON/Document values. 
- Changed the name of inputFields to always be lower case for ease of manipulation during search.

#### How to Use: 
- When adding search fields to `search.json` including `upper bound` in the subfield name means that this value is the greatest value that the field can have.
- Likewise including `lower bound` in the subfield name means that this value is the lowest value that the field can have. 
- The rest of the name would be the field name in the database e.g. `Longitude Upper Bound` will search the `longitude` field in each entry's `inputFields` objects.

#### Known Issues:
- ~~`/dataentry` endpoint format doesn't fully match the format used by the `/search` endpoint, not sure how. Tried to take a look at it and it seemed fine. Should be easy to figure out.~~

## Search Screen Changes & App Icon Change
#### Changes:
- Search screen now displays its subfields under the dropdown that triggered them.
- App icon changed to Scales Nature Park logo.

##### How to use:
- To change the icon, generate an icon package using [makeappicon](https://makeappicon.com/). 
- Place the package in `/path/to/project/android/app/src/main/res`.

#### Known issues:
- ~~Selecting a different criteria from the default one doesn't delete all previous subfields from the triggering dropdown, instead it sometimes removes some elements from the dropdown below it.~~
- ~~Select image field in `Data Entry` screen doesn't have backend support for storing the image, might need cloud storage, BSON or seperate axios call to store file in the database seperately.~~
    * Last option seems most viable until we understand BSON, only problem is that it can be slow and data wont be uploaded until the image uploads (internet issue - important).

#### Future Improvements:
- ~~Fix known issues.~~
- Complete `search.json` and `fields.json`
- Add functionality where a selected criteria doesn't appear in the other dropdowns on the screen.
- ~~Add backend support.~~
    * Could be static handler that searches just the criteria specified during development. (Not considered)
    * ~~Another approach can also be comparing the field name or subfield names to existing fields in the database and if they match search for entries that match the value of that field.~~

## Saved Entries
#### Changes: 
- Added some local support for storing and loading data entries offline. 

#### How to use: 
- Entries can be saved using the `Quick Save` button in `Data Entry` screen, use `Save` for data validation before saving.
- Saved Entries screen displays all the saved entries on the device.

#### Future Improvements:
- Remove previous saved entries once submitted to the database or edited resaved locally as a new entry.

## Offline Mode and Local Storage
#### Changes:
- Moved the Mongo database locally.
- Added offline mode for the app that can be accessed through the `OFFLINE MODE` button in the initial login screen.
- Added `QUICK SAVE` and `SAVE` buttons in the data entry screen. Both buttons allow the user to save the entered data locally on their phone however `SAVE` requires some extra data validation before storing the data locally (data validation functions from `fields.json`).

#### How to use: 
- No extra steps have been added from previous log, just need to add the new link in the `MONGODB` environment variable.

#### Future Improvements: 
- Need to add some security credentials to the local database so it isn't accessible by any device on the network.
- ~~Integrate the data validation functions from `fields.json` file.~~
- ~~Start working on the `Saved Entries` screen to allow the user to edit them and submit them when accessed in online mode.~~

## Node Server and DataBase Connection
#### Changes:
- Some structure changes to the repo: all the react-native client side is in `app` folder. and node.js server side in the `server` folder.
- Established 2-way communication between react-native front end of the app and the node server using axios calls on the client side and express endpoints on the server side.
- Established a server side database connection to an Azure hosted MongoDB database. 
 
 #### How to use:
 - You need to setup an environment variable named `MONGODB` that contains the database uri which can be retrieved through the Scales Dev MongoDB account.
 - You can also setup a `PORT` environment variable that sets the server 
 - To run the server you should run the `dev` script in package.json using `npm run dev` from the `server` folder. Make sure your environment variable(s) are set before running the script.  

 #### Notes: 
 - You should `npm install` in both the `app` and `server` folders to install the packages of both projects.
 - No structure changes were made to the `app` project so you can continue using that like before: `npm start` and `npm run <platform>`. 

## Generic Data Entry Form
Implemented a mostly generic data entry form that reads the fields from `fields.json` file in the root directory.

#### fields.json Format:
- File is a list of json objects where each object represents a category and its conditional fields. 
- Non-conditional fields are to be placed in the "All" category object.
- `conditionalFields` element in each object is an array of JSON objects.
- Each conditional field consists of at least `string:name` and `boolean:dropDown`. 
- In the case `dropDown` is true then a list of `values` should be specified.
- Each field can also have its own `conditionalFields` with a `condition` element that specifies a value that if satisfied, `condtionalFields` are to be rendered.
- `dataValidation` is an object with arguments and body to a function that validates data input, in the case the function is violated, program will alert the user to fix their input.

#### Future Improvements:
- ~~Need to add a generic framework for specifying categories instead of the current 3 static categories `Turtle, Snake, Lizard`.~~
- Fill the `fields.json` file with all the fields from google sheets.


#### TODO: 
- ~~Build `Home` screen that directs the user to all screens in the app.~~
- ~~Start building express endpoints in node.js.~~