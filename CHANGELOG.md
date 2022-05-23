# ChangeLog
This file is intended for tracking development progress, edit this file everytime you make changes to the codebase with a message stating your changes; Example: ```Implemented Components A & B.``` For longer and more complex
changes, please include a short explanation of what your changes are trying to achieve, how they're integrated
with the rest of the codebase and/or how to run and build up on them. You can treat this file as a more in depth
commit log and place your changes over the previous changes, below this message.

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
- Need to add a generic framework for specifying categories instead of the current 3 static categories `Turtle, Snake, Lizard`.
- Fill the `fields.json` file with all the fields from google sheets.


#### TODO: 
- Build `Home` screen that directs the user to all screens in the app.
- Start building express endpoints in node.js.