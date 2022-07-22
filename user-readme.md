# START Data Entry App
An android mobile application for the START project.

## Download and Install:
### Pre-Requisites
- Download file manager from the google playstore (or any apk installer if you have one.)
- Go to settings and lookup `Install Unkown Apps` or `Unknown Apps` and select the `Install Unknown Apps` setting.
- Press on File Manager or your apk installer's name and then enable the `Allow from this source` slider button.

### Installation
- Navigate to the app's [google drive releases](https://drive.google.com/drive/folders/1htu5aFVvjbre9UioeIg1tlfw5Ne_UXyG) master folder.
- Open the most recent version's folder.
- If you know your phone's processor architecture, e.g `armx86` download the respective file for it. 
- Otherwise, download the `app-universal-release.apk` file.
    `Note: Download the file by pressing the 3 dots and then pressing download.`
- Open `File Manager / your apk installer` and press on the downloaded apk file. It should then prompt you for Installing the app, press Install.

## How to Use App:
### Features:
The home screen links to 4 main screens:

#### Data Entry:
- That's where you will enter field observations.
- You can use `Quick Save` for saving your data to the `Saved Entries` screen or `Save` to validate the data before saving.
- Pressing submit will send your observation to the database after validating it and you won't be able to make further changes to the data after that without contacting an admin.

#### Saved Entries:
- This displays all your saved previous entries on the phone.
- Pressing on an entry will direct you to the data entry screen where you can edit the saved values and resave or submit to the server if in user-mode.
- Pressing the `X` button on a saved entry will delete the entry from local device storage after a confirmation prompt.

#### Search:
- Here you can search previous entries submitted to the database.
- Selecting a category e.g Snake will only display results of snake observations.
- Pressing `Add Criteria` button will display a new dropdown where you can choose the criteria you want to search based on and a set of conditional fields that you can fill with values to filter the results.
- Pressing the `Search` button will display all the resulting entries in the same style as the Saved Entries are displayed.

#### Account:
- This screen is for managing your account and is not available for Guest Mode.
- You can update your password by entering your current password and the new one, then pressing update password.
- Pressing on `Delete Account` will permanently delete your account from the database after a confirmation prompt. 

## Modes
There are 2 modes for this app:

#### User Mode:
- If you have an existing account, you can type in your credentials and login.
- Otherwise, you can press `Signup` and create a new account.
- In this mode you will be able to submit existing saved entries as well as new entries.

#### Guest Mode: 
- You can perform most of the operations allowed in this mode offline, which can be helpful for taking observations in the field without an internet connection.
- In the `Data Entry` screen you can use `Quick Save` to save your entry on the phone without data validation. 
- Use the `Save` button to validate all the data before saving it, you can then submit your entry to the database in user mode without any further edits.
- Once an entry is saved, it will appear at the top of the `Saved Entries` screen.
- You can perform search operations in guest mode but that will require an internet connection.
