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
    * You need write permissions to your account to access this feature. Check [permissions](#permissions).
    * This feature is not available in `Guest Mode`. Check [modes](#modes).

#### Saved Entries:
- This displays all your saved previous entries on the phone.
- Pressing on an entry will direct you to the data entry screen where you can edit the saved values and resave or submit to the server if in user-mode.
- Pressing the `X` button on a saved entry will delete the entry from local device storage after a confirmation prompt.
- Pressing the upload icon on an entry will prompt you for a username, you can enter a username and press `Share` to share the data entry with an account or `Cancel` to cancel share process. 

#### Search:
- This screen is only available for accounts with read permissions. Check [permissions](#permissions).
- Here you can search previous entries submitted to the database.
- Selecting a category e.g Snake will only display results of snake observations.
- Pressing `Add Criteria` button will display a new dropdown where you can choose the criteria you want to search based on and a set of conditional fields that you can fill with values to filter the results.
- Pressing the `Search` button will display all the resulting entries in the same style as the Saved Entries are displayed.
- Pressing on a specific entry will redirect you to the Data Entry screen and you will be able to view the data & images but will not be able to save changes.
- Pressing the `Export` button will export all the resultant entries to a csv file and a list of image folders in a new google drive folder and a notification will pop up in the bottom of the screen with the shareable link, clicking the copy button will copy the link to clipboard which you can later paste in a browser to open the folder. 
- Pressing the upload icon on an entry will prompt you for a username, you can enter a username and press `Share` to share the data entry with an account or `Cancel` to cancel share process. 


#### Account:
- This screen is for managing your account and is not available for Guest Mode.
- You can update your password by entering your current password and the new one, then pressing update password.
- Pressing on `Delete Account` will permanently delete your account from the database after a confirmation prompt. 

## Permissions
There are 2 permissions that a user may have:

#### Read Permission: 
Under this permission you will have access to [Search Screen](#search) and all its functionalities.

#### Write Permission: 
Under this permission you will have access to the Submit button in the data entry screen allowing you to submit data to the database.

> Acquiring those permissions can be requested from a senior staff member who has access to the admin windows app. 

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

## Updates 
- In app updates are small changes made to the app like input fields and will be automatically downloaded when first launching the app with an internet connection after an update has been released.
- Source updates are changes made to the app structure itself and require you to delete the old version of the app and install the latest version from the google drive folder. These updates are usually released to resolve bugs and/or add new features. 
- It is recommended to download any updates once they are released, especially in earlier versions of the app. 