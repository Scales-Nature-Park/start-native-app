# START Data Entry App
An android mobile application for the START project.

## Download and Install:
- Navigate to the app's [google drive releases]() master folder.
- Open the most recent version's folder.
- If you know your phone's processor architecture, e.g `armx86` download the respective file for it. 
- Otherwise, download the `app-universal-release.apk` file.
- Downloads manager, should then prompt you for Installing the app, respond to these prompts accordingly.
    * You may get `'Untrusted developer warnings.'` You can ignore these and proceed with the installation process.

## How to Use App:
##### Features:
The home screen links to 3 main screens:

##### Data Entry:
- That's where you will enter field observations.
- You can use `Quick Save` for saving your data to the `Saved Entries` screen or `Save` to data validate the data before saving.
- Clicking submit will send your observation to the database after validating it and you won't be able to make further changes to the data after that without contacting an admin.

###### Saved Entries:
- This displays all your saved previous entries on the phone.
- Clicking on an entry will direct you to the data entry screen where you can edit the saved values and resave or submit to the server if in user-mode.

###### Search:
- Here you can search previous entries submitted to the database.
- Selecting a category e.g Snake will only display results of snake observations.
- Clicking `Add Criteria` button will display a new dropdown where you can choose the criteria you want to search based on and a set of conditional fields that you can fill with values to filter the results.
- Cling the `Search` button will display all the resulting entries in the same style as the Saved Entries are displayed.

There are 2 modes for this app:

#### User Mode:
- If you have an existing account, you can type in your credentials and login.
- Otherwise, you can click `Signup` and create a new account.
- In this mode you will be able to submit existing saved entries as well as new entries.

#### Guest Mode: 
- You can perform most of the operations allowed in this mode offline, which can be helpful for taking observations in the field without an internet connection.
- In the `Data Entry` screen you can use `Quick Save` to save your entry on the phone without data validation. 
- Use the `Save` button to validate all the data before saving it.
- Once an entry is saved, it will appear at the top of the `Saved Entries` screen.
- You can perform search operations in guest mode but that will require an internet connection.
