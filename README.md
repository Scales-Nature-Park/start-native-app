# Data Entry App
A MERN based data entry system that consists of a mobile data entry app and an administrator windows app for managing user credentials and data entry features.

## Contributing
Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to join us in the development of this project.

## Features
- A Generic data entry form modifiable through the `fields` collection in the mongo database.
- A search functionality that allows users to query data entries based on specified criteria.
- An export functionality that allows users to export single or groups of data entries into a google drive shareable folder with  

## Components
![Project Chart](./assets/images/projectchart.jpg)
- React-native based mobile & windows desktop interfaces, making http requests to the server on user interactions. Check [app readme](./app/README.md) for more information on the mobile app and [admin readme](./admin/README.md) for more information on the admin app.
- Local Mongo Database storing collections of login credentials, submitted & shared data entries, data entry images and data entry fields.
- Node.js server with express.js endpoints querying the database and responding to the http requests made by the apps. Check [server readme](./server/README.md).

## Fields.json Format
`fields.json` is located at [./app/utils/fields.json](./app/utils/fields.json). It specifies all the fields which the `Data Entry` screen is dependent on. To modify the `fields.json` file a specific format must be followed:
```json
[
    {
        "Category": "required string",
        "ConditionalFields":  [
            {
                "name": "required string",
                "dropdown": true,
                "values": ["string", "string"],
                "dataValidation": {
                    "isNumber": false,
                    "arguments": "input",
                    "body": "return input > 4;",
                    "error": "Data validation condition failed."
                },
                "ConditionalFields": []
            }
        ]
    }
]
```
- Only the `Category` field in each of the main objects and the `name` in each conditional field is required. 
- Adding a new object with a `Category` and `ConditionalFields` will create a new button at the top next to `Turtle`, `Snake` etc. and selecting that will render all the fields in the `All` category and that new object you created.
- You can nest `ConditionalFields` as shown above.
- `dataValidation` element is a function that gives the user an error when Submitting data to the server or Saving using the validated `Save` button from data entry, `Quick Save` doesn't use data validation.
    * arguments: should just be one taking in the value entered in the field or selected in the dropdown.
    * body: the condition that the data must meet to pass the data validation.
    * error: error message given to the user in case the condition isn't met.
    * isNumber: boolean indicating if the value is a number or not.

## Search.json Format
`search.json` is located at [./app/utils/json/search.json](./app/utils/json/search.json). It specifies all the search criteria fields which the `Search` screen is dependent on. To modify the `fields.json` file a similar format to `fields.json` must be followed:
```json
[
    {
        "Category": "required string",
        "ConditionalFields":  [
            {
                "name": "required string",
                "dropdown": true,
                "values": ["string", "string"],
                "Subfields": [
                    {
                        "name": "required string",
                        "dropdown": false
                    }
                ] 
            }
        ]
    }
]
```
- Similar to the `fields.json` each object added to the main list, its category name is added to the category buttons at the top except the object with name == "All". Conditional criteria under the 'All' category will be displayed no matter which button is selected at the top.
- For each object added to the conditional criteria lists a new option in the search criteria dropdowns is made with the name element and the Subfields are displayed under the dropdown on selection. 
- Subfields are not required and if not specified, the screen displays a single "sub field" under the dropdown for the selected field inheriting the name of the parent field.

## License
This project is MIT licensed, as found in the [LICENSE](./LICENSE) file.