# ChangeLog
This file is intended for tracking development progress, edit this file everytime you make changes to the codebase with a message stating your changes; Example: ```Implemented Components A & B.``` For longer and more complex
changes, please include a short explanation of what your changes are trying to achieve, how they're integrated
with the rest of the codebase and/or how to run and build up on them. You can treat this file as a more in depth
commit log and place your changes over the previous changes, below this message.

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